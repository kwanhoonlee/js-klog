package chunk

import (
	"errors"
	"fmt"
	"io"
	"strconv"
	"strings"
)

var (
	ErrRabinMin = errors.New("rabin min must be greater than 16")
	ErrSize     = errors.New("chunker size muster greater than 0")
)

// FromString returns a Splitter depending on the given string:
// it supports "default" (""), "size-{size}", "rabin", "rabin-{blocksize}" and
// "rabin-{min}-{avg}-{max}".
func FromString(r io.Reader, chunker string) (Splitter, error) {
	switch {
	case chunker == "" || chunker == "default":
		return DefaultSplitter(r), nil

	case strings.HasPrefix(chunker, "size-"):
		sizeStr := strings.Split(chunker, "-")[1]
		size, err := strconv.Atoi(sizeStr)
		if err != nil {
			return nil, err
		} else if size <= 0 {
			return nil, ErrSize
		}
		return NewSizeSplitter(r, int64(size)), nil

	case strings.HasPrefix(chunker, "rabin"):
		return parseRabinString(r, chunker)

	case strings.HasPrefix(chunker, "klog") :
		sizeStr := strings.Split(chunker, "-")[1]
		size, err := strconv.Atoi(sizeStr)
		if err != nil {
			return nil, err
		} else if size <= 0 {
			return nil, ErrSize
		}
		return NewKlogSplitter(r, int64(size)), nil

	default:
		return nil, fmt.Errorf("unrecognized chunker option: %s", chunker)
	}
}

func parseRabinString(r io.Reader, chunker string) (Splitter, error) {
	parts := strings.Split(chunker, "-")
	
	switch len(parts) {
	case 1:
		return NewRabin(r, uint64(DefaultBlockSize)), nil

	case 2:
		size, err := strconv.Atoi(parts[1])
		if err != nil {
			return nil, err
		}
		return NewRabin(r, uint64(size)), nil

	case 4:
		sub := strings.Split(parts[1], ":")
		if len(sub) > 1 && sub[0] != "min" {
			return nil, errors.New("first label must be min")
		}
		min, err := strconv.Atoi(sub[len(sub)-1])
		if err != nil {
			return nil, err
		}
		if min < 16 {
			return nil, ErrRabinMin
		}
		sub = strings.Split(parts[2], ":")
		if len(sub) > 1 && sub[0] != "avg" {
			log.Error("sub == ", sub)
			return nil, errors.New("second label must be avg")
		}
		avg, err := strconv.Atoi(sub[len(sub)-1])
		if err != nil {
			return nil, err
		}

		sub = strings.Split(parts[3], ":")
		if len(sub) > 1 && sub[0] != "max" {
			return nil, errors.New("final label must be max")
		}
		max, err := strconv.Atoi(sub[len(sub)-1])
		if err != nil {
			return nil, err
		}

		return NewRabinMinMax(r, uint64(min), uint64(avg), uint64(max)), nil
	default:
		return nil, errors.New("incorrect format (expected 'rabin' 'rabin-[avg]' or 'rabin-[min]-[avg]-[max]'")
	}
}
