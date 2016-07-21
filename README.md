# Flow


## Typical Sort Flow

A ‘typical’ message transaction to sort a parcel would flow as follows.

1. Plant Floor Controller to XLe PLC_MSG (Tray or Parcel ID)
2. XLe to Plant Floor Controller SORT (Sort Instruction)
3. Plant Floor Controller to XLe ACK–SORT
4. Plant Floor Controller to XLe SORTCONF (Sort Confirmation)
5. XLe to Plant Floor Controller ACK–SORTCONF


### Example

```
192.168.1.4,PCF-0003,192.168.1.7,XLe-1234,PLC_MSG,001234
192.168.1.7,XLe-1234,192.168.1.4,PCF-0003,SORT,ND-0001-21:46:06:548-00000000001,00001,00002,00003,00004
192.168.1.4,PCF-0003,192.168.1.7,XLe-1234,ACK-SORT,ND-0001-21:46:06:548-00000000001
192.168.1.4,PCF-0003,192.168.1.7,XLe-1234,SORTCONF,TT–0001–23:59:01:998–12345678901,TR12341234567890A0A0A0A,1Z0318017912345678,00012,0–0–0–0–0,0002
192.168.1.7,XLe-1234,192.168.1.4,PCF-0003,,ACK-SORTCONF,TT–0001–23:59:01:998–12345678901
```

## Typical Close Flow

A ‘typical’ message transaction for a small sort container close would flow as follows.

1. Plant Floor Controller to XLe CONTCLOSE (Container Close)
2. XLe to Plant Floor Controller ACK–CONTCLOSE
3. XLe to Plant Floor Controller INDICATOR (Indicator On or OFF)
4. Plant Floor Controller to XLe ACK–INDICATOR

### Example

```
TODO
```

## Configuring Sorting

For testing purposes, it's useful to configure sequences of sorts.

```
3 00001,00002,00004,00005
4 00001,00002,00004,00005
15 00001,00002,00004,00005
* 00001
```

# Unanswered Questions

* Do I care about what's in the RCN fields (some note about PLCID and RCN field)?
  * assuming I can just always respond back to the same client / socket
* What about the contents of message IDs?

# Backlog

* "ack" and resend (think i can ignore ack)
* sortconf
* heartbeat
* indicator
* contclose
* detect a PLC's type / name
* some UI
