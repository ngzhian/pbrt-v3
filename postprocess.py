with open('test.pfm') as f:
    with open('out.pfm', 'wb') as o:
        # read headers
        for i in range(3):
            o.write(bytearray(f.readline(), encoding='utf-8'))
        # last byte is new line, don't need it
        data = f.readline()[:-1]
        # read 8 characters at a time, they form a single float
        for i in range(0, len(data), 8):
            fp = data[i:i+8];
            # write out in little endian
            ints = [int(fp[i*2:i*2+2], 16) for i in range(3,-1,-1)]
            o.write(bytearray(ints))
