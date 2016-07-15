## Design

See diagrams on page 26-27.

A UPV will scan packages as they pass through a tunnel, identifying their package IDs / tracking numbers.

The XLe server knows which PLC to send the package to (based on a tray / cell ID read from the package). It generates a stream of SORT messages to the PLC.

## Testing

There are a few different configurations to test sorting.

* load a set of package ID -> destination values.
* 

## Heartbeat / Ping (p29)

Ping from XLe
`10.1.1.2,XLE–0001,10.1.1.3,PFC–0123,HB,TT–0001–23:59:01:998–12345678901 {CRLF}`

Ping from PLC
`192.168.1.2,PFC,192.168.1.2,PFC,HEARTBEAT,TT-0001-12:23:18:6112-12345678910{CRLF}`

## Sort

```
10.1.1.2,XLE–0001,10.1.1.3,PFC–0123,SORT,TT–0001–23:59:01:998–12345678901,TR12341234567890A0A0A0A,

1Z0318017912345678,E|012301240230,00001,09999,00123,01111 {CRLF}

10.1.1.2,XLE–0001,10.1.1.3,PFC–0123,SORT,TT–0001–23:59:01:998–12345678901,3R12341234567890A0A0A0A,??????????????????,

M|012301240230,00001,09999,00123,01111 {CRLF}

10.1.1.2,XLE–0001,10.1.1.3,PFC–0123,SORT,TT–0001–23:59:01:998–12345678901,TR12341234567890A0A0A0A,##################,

E|012301240230,00001,09999,00123,01111 {CRLF}
```

## Typical Flow

A ‘typical’ message transaction to sort a parcel would flow as follows.

1. Plant Floor Controller to XLe PLC_MSG (Tray or Parcel ID)

2. XLe to Plant Floor Controller SORT (Sort Instruction)

3. Plant Floor Controller to XLe ACK–SORT

4. Plant Floor Controller to XLe SORTCONF (Sort Confirmation)

5. XLe to Plant Floor Controller ACK–SORTCONF

Note: Chat Message RCN field must be configured for camera system IP