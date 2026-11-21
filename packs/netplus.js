(function(){
function q(d,t,r,w,e,x){return {d:d,q:t,o:[r].concat(w),a:0,e:e,r:x}}
function c(f,b,d,m){var o={f:f,b:b,d:d};if(m)o.m=1;return o}
var Q=[
/* 1 Networking Concepts */
q(1,"Which OSI layer is responsible for MAC addressing and switching frames?","Layer 2, Data Link",["Layer 1, Physical","Layer 3, Network","Layer 4, Transport"],"Switches forward frames by MAC address at Layer 2. Routers work at Layer 3 with IP addresses.","1.1 OSI model"),
q(1,"Which protocol is connectionless and commonly used for DNS queries and VoIP?","UDP",["TCP","ICMP","ARP"],"UDP has no handshake or retransmission, which suits small, time-sensitive exchanges.","1.5 Transport protocols"),
q(1,"What are the three steps of the TCP handshake?","SYN, SYN-ACK, ACK",["SYN, ACK, FIN","ACK, SYN, RST","DISCOVER, OFFER, REQUEST"],"The client sends SYN, the server answers SYN-ACK, and the client confirms with ACK.","1.5 Transport protocols"),
q(1,"Which sequence describes DHCP lease acquisition?","Discover, Offer, Request, Acknowledge",["Request, Offer, Discover, Acknowledge","Offer, Discover, Acknowledge, Request","Discover, Request, Offer, Acknowledge"],"DORA: the client broadcasts Discover, a server Offers, the client Requests, the server Acknowledges.","1.5 Services"),
q(1,"Which DNS record creates an alias from one name to another?","CNAME",["A","MX","PTR"],"A CNAME points a name at another name. A maps to IPv4, MX identifies mail servers, PTR is reverse lookup.","1.5 DNS records"),
q(1,"Which of these is not a private IPv4 address?","172.32.0.1",["172.16.5.9","172.31.255.1","10.200.0.1"],"The private range 172.16.0.0/12 covers 172.16.0.0 through 172.31.255.255. 172.32.x.x is public.","1.4 IP addressing"),
q(1,"How many usable host addresses are in a /27 subnet?","30",["32","28","62"],"A /27 leaves 5 host bits: 32 addresses, minus the network and broadcast addresses.","1.4 Subnetting"),
q(1,"Which cloud model gives the customer control of the OS and applications but not the physical hardware?","IaaS",["SaaS","PaaS","DaaS only"],"IaaS provides virtual machines, storage and networking. In PaaS the provider also manages the OS and runtime.","1.2 Cloud concepts"),
q(1,"In a spine-and-leaf data center design, how are the switches connected?","Every leaf connects to every spine",["Every leaf connects to every other leaf","Spines connect in a ring","Leaves connect only to one spine"],"This gives predictable, equal-length paths between any two servers and scales by adding leaves or spines.","1.3 Network topologies"),
q(1,"Which IPv6 address type delivers to the nearest of several devices sharing the same address?","Anycast",["Unicast","Multicast","Broadcast"],"Anycast routes to the topologically closest member. IPv6 has no broadcast.","1.4 IPv6"),
q(1,"Which protocol uses UDP port 161 for management queries?","SNMP",["Syslog","NTP","TFTP"],"SNMP agents listen on UDP 161 and send traps to the manager on UDP 162.","1.5 Ports"),
q(1,"What does a VLAN do?","Splits a switch into separate broadcast domains",["Encrypts traffic between connected switches","Extends the maximum copper cable length","Removes the need for any routing between segments"],"Each VLAN is its own broadcast domain, and a router or Layer 3 switch is needed to move traffic between them.","1.4 Network segmentation"),
/* 2 Network Implementation */
q(2,"Which standard provides up to 30 W of PoE per port?","802.3at (PoE+)",["802.3af","802.3bt Type 4","802.1X"],"802.3af provides 15.4 W, 802.3at provides 30 W, and 802.3bt provides 60 W or 90 W.","2.1 PoE"),
q(2,"What is the maximum length of a copper Ethernet twisted-pair segment?","100 meters",["55 meters","200 meters","300 meters"],"The standard limit is 100 m, including patch cords. Cat6 runs 10GBASE-T only to 55 m, and Cat6a to 100 m.","2.1 Cabling"),
q(2,"Why is single-mode fiber used for long distances?","Its narrow core lets light travel far with little dispersion",["It is cheaper than copper for short runs","It can carry electrical power to devices","It is immune to damage from tight bends"],"Single-mode runs for kilometers. Multimode has a wider core and is used inside buildings and data centers.","2.1 Fiber"),
q(2,"Which Wi-Fi standard operates only in the 5 GHz band among these choices?","802.11ac",["802.11b","802.11g","802.11n"],"802.11b and g are 2.4 GHz only, and 802.11n works in both bands. 802.11ac (Wi-Fi 5) is 5 GHz only.","2.3 Wireless"),
q(2,"Which feature combines several physical links into one logical link?","Link aggregation (LACP)",["Spanning tree","VLAN trunking","Port mirroring"],"LACP (802.1AX) bundles links for bandwidth and redundancy and appears to the network as one interface.","2.2 Switching features"),
q(2,"Which routing protocol uses hop count with a maximum of 15?","RIP",["OSPF","EIGRP","BGP"],"RIP treats 16 hops as unreachable. OSPF uses link state and cost.","2.2 Routing"),
q(2,"Which transceiver type supports 10 Gbps?","SFP+",["SFP","GBIC","RJ-11"],"SFP is 1 Gbps, SFP+ is 10 Gbps, QSFP+ is 40 Gbps.","2.1 Transceivers"),
q(2,"What does NAT do on a home router?","Translates private addresses to a public address",["Assigns MAC addresses to devices on the LAN","Encrypts all traffic leaving the network","Blocks all inbound traffic without any rules"],"Source NAT with port translation lets many private hosts share one public address.","2.2 NAT"),
q(2,"Which device operates by default as the boundary between broadcast domains?","A router",["A hub","An unmanaged switch","A repeater"],"Routers do not forward broadcasts, so each interface is its own broadcast domain.","2.2 Devices"),
/* 3 Network Operations */
q(3,"Which technology reports who is talking to whom, with flow-level traffic statistics?","NetFlow or IPFIX",["SNMP traps","Syslog","DHCP snooping"],"Flow records summarize conversations by source, destination, ports and volume. They help find top talkers and unusual traffic.","3.2 Monitoring"),
q(3,"What does the 3-2-1 backup rule describe?","Three copies, on two media types, with one offsite",["Three servers, two sites, one cloud","Three full, two incremental, one differential","Three days, two weeks, one month"],"It reduces the chance that a single failure destroys every copy.","3.3 Disaster recovery"),
q(3,"Which protocol keeps device clocks synchronized?","NTP",["SNMP","SMTP","LDAP"],"NTP uses UDP 123. Accurate time is vital for logs, Kerberos and certificates.","3.2 Network services"),
q(3,"Which first-hop redundancy protocols provide a virtual gateway?","HSRP and VRRP",["STP and RSTP","LACP and PAgP","OSPF and BGP"],"Two or more routers share a virtual IP so hosts keep working if the active router fails.","3.3 High availability"),
q(3,"What does QoS with DSCP markings accomplish?","Prioritizes traffic types such as voice over others",["Encrypts voice calls end to end","Assigns IP addresses to phones automatically","Blocks all video traffic on the network"],"DSCP is a field in the IP header that routers and switches use to apply queuing and priority.","3.2 Quality of service"),
q(3,"Why record a configuration baseline?","To compare current behavior against a known good state",["To increase available bandwidth on the network","To avoid the need for configuration backups","To reduce the length of cable runs"],"Baselines make anomalies and unauthorized changes visible.","3.1 Documentation"),
/* 4 Network Security */
q(4,"Which attack floods a switch with fake source MAC addresses to fill its CAM table?","MAC flooding",["ARP poisoning","DNS spoofing","VLAN hopping"],"When the table is full, the switch floods traffic like a hub. Port security limits MACs per port.","4.2 Attacks"),
q(4,"Which action helps prevent VLAN hopping?","Disable unused ports and DTP, and avoid VLAN 1 as native",["Enable PortFast on every port in the switch","Put every device in a single shared VLAN","Raise the STP priority on the access switches"],"Attackers use DTP negotiation or double tagging. Hard-set access ports and unused-port shutdown close both paths.","4.2 Attacks"),
q(4,"What does split tunneling do on a VPN client?","Sends only corporate-bound traffic through the VPN",["Splits each packet across two separate VPN tunnels","Encrypts only video traffic and sends the rest in clear","Blocks access to local printers on the home network"],"Other traffic goes directly to the internet, which saves bandwidth but bypasses corporate inspection.","4.3 Remote access"),
q(4,"A malicious access point copies a legitimate SSID to trick users into connecting. What is it?","An evil twin",["A rogue DHCP server","A honeypot","A war driver"],"An evil twin impersonates a real network, often to capture credentials or traffic.","4.2 Wireless attacks"),
q(4,"Which standard provides port-based authentication before a device gets network access?","802.1X",["802.11ac","802.3af","802.1D"],"802.1X uses EAP with a RADIUS server to authenticate the supplicant through the switch or AP.","4.1 Access control"),
/* 5 Network Troubleshooting */
q(5,"Per CompTIA's methodology, what step follows establishing a theory of probable cause?","Test the theory to determine the cause",["Document the findings and the actions taken","Implement the solution on the production network","Verify full system functionality afterward"],"The order: identify the problem, establish a theory, test it, establish a plan of action, implement, verify, document.","5.1 Troubleshooting methodology"),
q(5,"Which command tests the local TCP/IP stack without using the network?","ping 127.0.0.1",["ping the default gateway","tracert the server","nslookup localhost"],"The loopback address stays inside the host, so success shows the stack and NIC driver are loaded.","5.3 Tools"),
q(5,"Which tool shows each router hop on the path to a destination?","traceroute (tracert on Windows)",["ping, which only reports round-trip time","nslookup, which only queries DNS records","netstat, which only lists local connections"],"It uses increasing TTL values to learn each hop and where delay or loss begins.","5.3 Tools"),
q(5,"Which tools query DNS and show the answers returned?","nslookup and dig",["arp and route","netstat and ss","ipconfig and ifconfig"],"Use them to test a specific resolver and compare records.","5.3 Tools"),
q(5,"Which command displays the IP-to-MAC address cache?","arp -a",["ipconfig /all","route print","netstat -r"],"arp -a lists learned mappings and helps find duplicate IPs or bad entries.","5.3 Tools"),
q(5,"Which tool locates a break in a long fiber run?","An OTDR",["A multimeter","A cable crimper","A punch-down tool"],"An optical time-domain reflectometer sends pulses and measures reflections to find breaks and their distance.","5.3 Hardware tools"),
q(5,"A technician must find which wall jack a cable connects to. Which tools help?","A tone generator and probe",["A loopback adapter","A spectrum analyzer","A cable stripper"],"The tone generator puts a signal on the cable and the probe finds it at the other end.","5.3 Hardware tools"),
q(5,"Two hosts report intermittent connectivity and each occasionally loses its connection. What is a likely cause?","A duplicate IP address",["A wrong subnet mask on the server","A bad Cat6 patch","An expired certificate"],"Two devices answering for one address take turns winning ARP, causing intermittent drops. Check arp -a and the DHCP scope for overlap.","5.2 Common issues"),
q(5,"A host can reach devices on its own subnet but nothing beyond it. What is the most likely cause?","A missing or wrong default gateway",["A bad DNS server","A duplicate MAC","An expired lease on the switch"],"Local traffic does not need the gateway. Remote traffic does.","5.2 Common issues"),
q(5,"Which command shows active connections and listening ports?","netstat -an",["tracert","nslookup","arp -s"],"netstat lists connections and listening sockets. On Linux ss is the modern equivalent.","5.3 Tools"),
q(5,"Users in one corner of an office report slow Wi-Fi and dropped connections. What should you check first?","Signal strength and interference or overlapping channels",["The DNS server addresses handed out by DHCP","Only the router's firmware version","The DHCP lease time on the wireless VLAN"],"A wireless site survey or analyzer shows coverage holes, co-channel interference and noise.","5.2 Wireless issues")
];
var cards=[
c("Layer 1 Physical","Bits on the medium: cables, hubs, signaling","",0),
c("Layer 2 Data Link","Frames and MAC addresses: switches, bridges","",0),
c("Layer 3 Network","Packets and IP addresses: routers","",0),
c("Layer 4 Transport","Segments and ports: TCP and UDP","",0),
c("Layer 5 Session","Starts, manages and ends sessions","",0),
c("Layer 6 Presentation","Formatting, encryption and compression","",0),
c("Layer 7 Application","Interfaces for network services: HTTP, DNS, SMTP","",0),
c("FTP 20/21","File transfer, clear text","",0),
c("SSH 22","Secure shell, SFTP and SCP","",0),
c("Telnet 23","Clear-text remote access","",0),
c("SMTP 25","Mail transfer; 587 for submission","",0),
c("DNS 53","Name resolution","",0),
c("DHCP 67/68","Server and client","",0),
c("TFTP 69","Trivial file transfer over UDP","",0),
c("HTTP 80 / HTTPS 443","Web and secure web","",0),
c("POP3 110 / IMAP 143","Mail retrieval; secure 995 and 993","",0),
c("NTP 123","Time sync","",0),
c("SNMP 161/162","Queries and traps","",0),
c("LDAP 389 / LDAPS 636","Directory services","",0),
c("SMB 445","Windows file sharing","",0),
c("Syslog 514","Logging","",0),
c("RDP 3389","Remote desktop","",0),
c("SIP 5060/5061","VoIP signaling","",0),
c("RFC 1918 ranges","10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16","",0),
c("APIPA","169.254.0.0/16 self-assigned when DHCP fails","",0),
c("Loopback","127.0.0.1 and ::1","",0),
c("MAC flooding","Fills the CAM table; fixed with port security","",0),
c("ARP poisoning","Fake ARP replies redirect traffic","Dynamic ARP Inspection helps.",0),
c("Evil twin","Rogue AP that impersonates a real one","",0),
c("Cat5e / Cat6 / Cat6a","1 Gbps; 1 Gbps (10G to 55 m); 10 Gbps to 100 m","",0),
c("Single-mode vs multimode","Single-mode goes kilometers; multimode shorter distances","",0),
c("Troubleshooting steps","Identify, theory, test, plan, implement, verify, document","",0),
c("ping 127.0.0.1","Tests the local TCP/IP stack","",1),
c("tracert / traceroute","Path and hop-by-hop delay","",1),
c("nslookup / dig","DNS queries","",1),
c("arp -a","IP-to-MAC cache","",1),
c("ipconfig /all","Windows IP configuration including DNS and DHCP","",1),
c("netstat -an","Connections and listening ports","",1),
c("OTDR","Finds fiber breaks","",0),
c("Tone generator and probe","Traces a cable to its jack","",0)
];
var PORTS=[["20/21","FTP","Clear text"],["22","SSH / SFTP",""],["23","Telnet","Clear text"],["25","SMTP",""],["53","DNS",""],["67/68","DHCP",""],["69","TFTP",""],["80","HTTP",""],["110","POP3",""],["123","NTP",""],["143","IMAP",""],["161/162","SNMP",""],["389","LDAP",""],["443","HTTPS",""],["445","SMB",""],["514","Syslog",""],["636","LDAPS",""],["993","IMAPS",""],["995","POP3S",""],["1433","MSSQL",""],["3306","MySQL",""],["3389","RDP",""],["5060/5061","SIP",""]];
var WIFI=[["802.11b","2.4 GHz","11 Mbps"],["802.11a","5 GHz","54 Mbps"],["802.11g","2.4 GHz","54 Mbps"],["802.11n (Wi-Fi 4)","2.4 and 5 GHz","600 Mbps"],["802.11ac (Wi-Fi 5)","5 GHz","about 6.9 Gbps theoretical"],["802.11ax (Wi-Fi 6/6E)","2.4, 5, and 6 GHz (6E)","about 9.6 Gbps theoretical"],["802.11be (Wi-Fi 7)","2.4, 5 and 6 GHz","about 46 Gbps theoretical"]];
var CABLE=[["Cat5e","1 Gbps","100 m"],["Cat6","1 Gbps; 10 Gbps up to 55 m","100 m (1G)"],["Cat6a","10 Gbps","100 m"],["Cat8","25/40 Gbps","30 m"],["Multimode fiber","Up to 10+ Gbps, shorter runs","Hundreds of meters"],["Single-mode fiber","High speed, long runs","Kilometers"]];
var OSI=[["7","Application","HTTP, DNS, SMTP"],["6","Presentation","Encryption, formats"],["5","Session","Session control"],["4","Transport","TCP, UDP, ports"],["3","Network","IP, routers"],["2","Data Link","MAC, switches"],["1","Physical","Cables, signals"]];
PACKS.push({id:"netplus",name:"Network+",short:"N+",code:"N10-009",color:"#a371f7",subnet:true,cardsName:"Ports and concepts",
note:"Built to N10-009 (launched June 20, 2024). CompTIA lists retirement as usually three years after launch, estimated 2027. Domain names follow the objective areas; check CompTIA's current objectives before booking.",
domains:[{n:1,t:"Networking Concepts",w:23},{n:2,t:"Network Implementation",w:20},{n:3,t:"Network Operations",w:19},{n:4,t:"Network Security",w:14},{n:5,t:"Network Troubleshooting",w:24}],
Q:Q,cards:cards,
ref:[
{t:"Ports",cols:["Port","Service","Note"],rows:PORTS},
{t:"OSI",cols:["Layer","Name","Examples"],rows:OSI},
{t:"Wi-Fi",cols:["Standard","Band","Speed"],rows:WIFI},
{t:"Cabling",cols:["Type","Speed","Distance"],rows:CABLE}
]});
})();
