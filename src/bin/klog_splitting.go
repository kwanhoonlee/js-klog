package chunk

import (
	"io"
	"io/ioutil"
	pool "github.com/libp2p/go-buffer-pool"	
)
const (
	kb = 1024
	mb = 1024 * 1024
	halfMB = mb / 2
	gb = mb * 1000
)

type klogChunker struct {
	middle int
	leaf int
	leafRemainder int
}

type klogSplitter struct {
	r io.Reader
	csize int //chunk size
	current int
	err error
	chunker klogChunker
}

func NewKlogSplitter(r io.Reader, s int64) *klogSplitter {
	klogChunker := NewKlogChunker(int(s))	
	return &klogSplitter {
		r: r,
		current: klogChunker.middle,
		chunker: klogChunker,
	}
} 

func getFileSize(r io.Reader) int {
	buf, _ := ioutil.ReadAll(r)
	return len(buf)
}

func NewKlogChunker(fsize int) klogChunker {
	var middle, leaf, leafRemainder int

	if fsize < 8 * mb && fsize >= 1 * mb {
		leaf = getMiddleSize(fsize)
	}else if fsize > 8 * mb && fsize <= 1392 * mb {
		middle = getMiddleSize(fsize)
		leaf, leafRemainder = getLeafSize(middle)
	}
	
	return klogChunker{
		middle : middle,
		leaf : leaf,
		leafRemainder : leafRemainder,
	}
}

func getMiddleSize(fsize int ) int {
	var size int 
	
	q := fsize / mb
	r := fsize % mb
	
	if r > halfMB {
		q += 1
		size = q * mb / 8 
	}else if r == 0 {
		size = q * mb / 8
	}else if r < halfMB {
		temp := float64(q) + 0.5
		size = int(temp * mb / 8)
	}

	return size
}

func getLeafSize(middle int) (int, int) {
	var leaf int
	var leafRemainder int

	q := middle / 174
	r := middle % 174

	if r == 0 {
		leaf = q
		leafRemainder = 0
	}else {
		leaf = q 
		leafRemainder = middle - (q * 173) 
	}

	return leaf, leafRemainder
}

func (ks *klogSplitter) NextBytes() ([]byte, error) {
	if ks.err != nil {
		return nil, ks.err
	}
	
	if ks.current == ks.chunker.leafRemainder && ks.chunker.leafRemainder != 0{
		ks.csize = ks.chunker.leafRemainder
	}else {
		ks.csize = ks.chunker.leaf
	}

	full := pool.Get(int(ks.csize))
	ks.current = ks.current - ks.csize
	if ks.current == 0 {
		ks.current = ks.chunker.middle
	}
	
	n, err := io.ReadFull(ks.r, full)
	switch err {
	case io.ErrUnexpectedEOF:
		ks.err = io.EOF
		small := make([]byte, n)
		copy(small, full)
		pool.Put(full)
		return small, nil
	case nil:
		return full, nil
	default:
		pool.Put(full)
		return nil, err
	}
	
}

func (ks *klogSplitter) Reader() io.Reader {
	return ks.r
}
