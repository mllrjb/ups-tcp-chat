## Flow


### Typical Flow

A ‘typical’ message transaction to sort a parcel would flow as follows.

1. Plant Floor Controller to XLe PLC_MSG (Tray or Parcel ID)

2. XLe to Plant Floor Controller SORT (Sort Instruction)

3. Plant Floor Controller to XLe ACK–SORT

4. Plant Floor Controller to XLe SORTCONF (Sort Confirmation)

5. XLe to Plant Floor Controller ACK–SORTCONF

Note: Chat Message RCN field must be configured for camera system IP

### Example

```
192.168.1.4,PCF-0003,192.168.1.7,XLe-1234,PLC_MSG,001234
192.168.1.7,XLe-1234,192.168.1.4,PCF-0003,SORT,ND-0001-21:46:06:548-00000000001,00001
```
