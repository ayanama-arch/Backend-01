### 1. What is a Switch?

- A **network switch** is a Layer 2 (Data Link layer) device in the OSI model.
- Its main job: **forward Ethernet frames** intelligently based on **MAC addresses**.
- Unlike a hub (which just floods traffic everywhere), a switch learns where devices are and sends traffic only to the right port.

---

### 2. What is a MAC Address?

- **MAC (Media Access Control) address** = unique 48-bit identifier assigned to every network interface card (NIC).
- Written in hex: `00:1A:2B:3C:4D:5E`.
- **Structure**:

  - **First 24 bits (OUI)** → identify manufacturer (Intel, Realtek, etc.).
  - **Last 24 bits** → unique device identifier (assigned sequentially by the vendor).

- Burned into hardware (though can be spoofed).

---

### 3. How Switches Use MAC Addresses

- Switches keep a **MAC Address Table (also called CAM table)**:

  - Maps each MAC address to the switch port it was learned from.
  - Example: `00:1A:2B:3C:4D:5E → Port 3`.

- **Learning**:

  - When a frame arrives, the switch notes the source MAC and associates it with that port.

- **Forwarding / Filtering**:

  - If the destination MAC is in the table → send frame only to that port.
  - If unknown → flood frame to all ports except the source.

- **Aging**:

  - Entries in the table have a timer (usually 300 sec). If no traffic from a MAC within that time, the entry is removed.

---

### 4. Types of MAC Addresses

- **Unicast MAC**: one-to-one (most common).
- **Broadcast MAC**: `FF:FF:FF:FF:FF:FF` → sent to all devices.
- **Multicast MAC**: special group address (e.g. for streaming).

---

### 5. Switch Behavior with MAC

- **Collision domain**: each switch port is its own collision domain (unlike hubs).
- **Broadcast domain**: by default, all ports on a switch are in the same broadcast domain. VLANs can segment this.
- **Duplex**: switches support full-duplex, so no collisions on a single port.

---

### 6. Security & MAC

- Switches can be configured with **port security**:

  - Limit number of MACs per port.
  - Bind a port to a specific MAC.
  - Protect against MAC flooding attacks (which try to overflow the CAM table).

---

### 7. Key Differences (Hub vs Switch)

- **Hub**: blind, repeats all frames to all ports (Layer 1).
- **Switch**: smart, forwards only where needed using MAC address table (Layer 2).

---

📌 **Summary nugget**:
A switch is basically a librarian. The MAC address is like a book’s call number. The switch builds a catalog (MAC table) mapping each "book" (device) to a "shelf" (port). This way, instead of shouting across the library (hub), it walks straight to the right shelf and delivers the book.

---

## Understanding Router and How Internet Works

## Understanding Networkign Layers

# **Complete Networking Notes: Routers, Internet & Layers**

## **Part 1: Understanding Routers**

### 1. What is a Router?

- A **router** is a Layer 3 (Network layer) device in the OSI model.
- Main job: **forward IP packets** between different networks based on **IP addresses**.
- Key difference from switches: routers connect different networks, switches connect devices within the same network.
- Routers make decisions based on **routing tables** and **routing protocols**.

---

### 2. How Routers Work

**IP Address vs MAC Address**:

- Routers work with **IP addresses** (logical addressing, Layer 3).
- They still use MAC addresses for local delivery (Layer 2).
- **Process**: Router receives packet → checks destination IP → consults routing table → forwards to next hop.

**Routing Table**:

- Contains network destinations and how to reach them.
- Example entry: `192.168.1.0/24 → Gateway: 10.0.0.1, Interface: eth0`.
- Shows: destination network, subnet mask, next hop, outgoing interface, metric (cost).

---

### 3. Router Functions

**Packet Forwarding**:

- Examines destination IP address in packet header.
- Looks up best route in routing table (longest prefix match).
- Decrements TTL (Time To Live) field.
- Forwards packet to next router or destination.

**Network Address Translation (NAT)**:

- Translates private IP addresses to public IP addresses.
- Enables multiple devices to share one public IP.
- Types: Static NAT, Dynamic NAT, PAT (Port Address Translation).

**DHCP (Dynamic Host Configuration Protocol)**:

- Automatically assigns IP addresses to devices.
- Also provides subnet mask, default gateway, DNS servers.

**Firewall & Security**:

- Access Control Lists (ACLs) to filter traffic.
- Stateful packet inspection.
- VPN termination.

---

### 4. Types of Routing

**Static Routing**:

- Manual configuration of routes.
- Good for small, stable networks.
- No bandwidth overhead.
- Example: `ip route 192.168.2.0 255.255.255.0 10.0.0.2`.

**Dynamic Routing**:

- Routers automatically learn routes using protocols.
- Adapts to network changes.
- **Interior Gateway Protocols (IGP)**:
  - **RIP** (Routing Information Protocol) - distance vector.
  - **OSPF** (Open Shortest Path First) - link state.
  - **EIGRP** (Enhanced Interior Gateway Routing Protocol) - hybrid.
- **Exterior Gateway Protocols (EGP)**:
  - **BGP** (Border Gateway Protocol) - used on internet backbone.

---

## **Part 2: How the Internet Works**

### 1. Internet Architecture

**Hierarchical Structure**:

- **Tier 1 ISPs**: Backbone providers (AT&T, Verizon, Level 3).
- **Tier 2 ISPs**: Regional providers, buy transit from Tier 1.
- **Tier 3 ISPs**: Local providers, customers of Tier 2.
- **Internet Exchange Points (IXPs)**: Where ISPs interconnect.

**Autonomous Systems (AS)**:

- Collection of networks under single administrative control.
- Each AS has unique AS number (ASN).
- BGP routes between ASes.

---

### 2. Key Internet Protocols

**Domain Name System (DNS)**:

- Translates domain names to IP addresses.
- Hierarchical structure: Root → TLD (.com, .org) → Authoritative.
- Process: Browser → Local DNS → Root → TLD → Authoritative → Response chain.

**HTTP/HTTPS**:

- **HTTP** (HyperText Transfer Protocol) - web communication.
- **HTTPS** - HTTP over SSL/TLS for security.
- Request methods: GET, POST, PUT, DELETE.
- Status codes: 200 (OK), 404 (Not Found), 500 (Server Error).

**TCP/IP Stack**:

- Foundation protocols of the internet.
- **IP** handles addressing and routing.
- **TCP** ensures reliable delivery.
- **UDP** for faster, connectionless communication.

---

### 3. Internet Communication Flow

**Example: Browsing a Website**

1. **DNS Resolution**: Browser asks DNS for website's IP address.
2. **Route Discovery**: Packets travel through multiple routers using BGP.
3. **TCP Connection**: Three-way handshake establishes connection.
4. **HTTP Request**: Browser sends GET request for webpage.
5. **Response**: Server sends HTML, CSS, JavaScript files.
6. **Rendering**: Browser displays the webpage.

**Packet Journey**:

- Your device → Home router (NAT) → ISP → Internet backbone → Destination ISP → Target server.
- Each router makes independent forwarding decisions.
- Packets might take different paths (load balancing).

---

## **Part 3: Networking Layers (OSI & TCP/IP Models)**

### 1. OSI Model (7 Layers)

**Layer 7 - Application**:

- **Function**: Network services to applications.
- **Protocols**: HTTP, HTTPS, FTP, SMTP, DNS, DHCP.
- **Examples**: Web browsers, email clients, file transfer.
- **Data Unit**: Data/Messages.

**Layer 6 - Presentation**:

- **Function**: Data formatting, encryption, compression.
- **Examples**: SSL/TLS, JPEG, GIF, ASCII, EBCDIC.
- **Services**: Character encoding, data encryption/decryption.
- **Data Unit**: Data.

**Layer 5 - Session**:

- **Function**: Establishes, manages, terminates sessions.
- **Examples**: NetBIOS, RPC, SQL sessions.
- **Services**: Session establishment, dialog control, session recovery.
- **Data Unit**: Data.

**Layer 4 - Transport**:

- **Function**: Reliable data transfer, flow control, error recovery.
- **Protocols**: TCP (reliable), UDP (fast, unreliable).
- **Services**: Segmentation, port numbers, reliability.
- **Data Unit**: Segments (TCP) / Datagrams (UDP).
- **Devices**: Gateways, advanced firewalls.

**Layer 3 - Network**:

- **Function**: Routing, logical addressing, path determination.
- **Protocols**: IP, ICMP, OSPF, BGP, RIP.
- **Addressing**: IP addresses (IPv4, IPv6).
- **Data Unit**: Packets.
- **Devices**: Routers, Layer 3 switches.

**Layer 2 - Data Link**:

- **Function**: Frame formatting, error detection, media access control.
- **Sublayers**:
  - **LLC** (Logical Link Control) - flow control, error control.
  - **MAC** (Media Access Control) - channel access, addressing.
- **Protocols**: Ethernet, Wi-Fi (802.11), PPP.
- **Addressing**: MAC addresses.
- **Data Unit**: Frames.
- **Devices**: Switches, bridges, NICs.

**Layer 1 - Physical**:

- **Function**: Electrical, optical, mechanical transmission.
- **Examples**: Copper cables, fiber optics, radio waves.
- **Specifications**: Voltage levels, timing, physical connectors.
- **Data Unit**: Bits.
- **Devices**: Hubs, repeaters, cables, wireless access points.

---

### 2. TCP/IP Model (4 Layers)

**Application Layer**:

- Combines OSI Layers 5, 6, 7.
- **Protocols**: HTTP, FTP, SMTP, DNS, DHCP, Telnet.

**Transport Layer**:

- Same as OSI Layer 4.
- **TCP**: Connection-oriented, reliable, ordered delivery.
- **UDP**: Connectionless, faster, no delivery guarantee.

**Internet Layer**:

- Same as OSI Layer 3.
- **IP**: Addressing and routing.
- **ICMP**: Error messages and diagnostics (ping, traceroute).

**Network Access Layer**:

- Combines OSI Layers 1 and 2.
- **Function**: Physical transmission and local network access.

---

### 3. Layer Interactions & Encapsulation

**Data Encapsulation Process (Sending)**:

1. **Application**: Creates data.
2. **Transport**: Adds TCP/UDP header → Segment.
3. **Network**: Adds IP header → Packet.
4. **Data Link**: Adds Ethernet header/trailer → Frame.
5. **Physical**: Converts to electrical/optical signals → Bits.

**Data De-encapsulation Process (Receiving)**:

- Reverse process: Bits → Frame → Packet → Segment → Data.

**Header Information**:

- **TCP Header**: Source/dest ports, sequence numbers, flags.
- **IP Header**: Source/dest IP addresses, TTL, protocol.
- **Ethernet Header**: Source/dest MAC addresses, EtherType.

---

### 4. Protocol Data Units (PDUs)

| Layer       | PDU Name         | Key Information                  |
| ----------- | ---------------- | -------------------------------- |
| Application | Data             | Application-specific information |
| Transport   | Segment/Datagram | Port numbers, reliability info   |
| Network     | Packet           | IP addresses, routing info       |
| Data Link   | Frame            | MAC addresses, error checking    |
| Physical    | Bits             | Electrical/optical signals       |

---

### 5. Real-World Layer Examples

**Sending an Email**:

- **Layer 7**: SMTP protocol formats email.
- **Layer 4**: TCP ensures reliable delivery.
- **Layer 3**: IP routes packets to mail server.
- **Layer 2**: Ethernet frames carry packets on local network.
- **Layer 1**: Electrical signals travel through cables.

**Web Browsing**:

- **Layer 7**: HTTP requests webpage.
- **Layer 4**: TCP manages connection to web server.
- **Layer 3**: IP routes packets across internet.
- **Layer 2**: Wi-Fi frames transmit on wireless network.
- **Layer 1**: Radio waves carry the data.

---

## **Part 4: Integration & Practical Examples**

### 1. Switch vs Router Comparison

| Feature               | Switch                  | Router                     |
| --------------------- | ----------------------- | -------------------------- |
| **OSI Layer**         | Layer 2 (Data Link)     | Layer 3 (Network)          |
| **Addressing**        | MAC addresses           | IP addresses               |
| **Domain**            | Single broadcast domain | Connects multiple networks |
| **Table**             | MAC address table       | Routing table              |
| **Collision Domains** | One per port            | Separate networks          |
| **Broadcast**         | Forwards broadcasts     | Blocks broadcasts          |
| **Main Function**     | Local network switching | Inter-network routing      |

### 2. Complete Network Communication Example

**Scenario**: Computer A (192.168.1.10) sends webpage request to Server B (203.0.113.50).

**Step-by-Step Process**:

1. **Application Layer**: Browser creates HTTP GET request.

2. **Transport Layer**: TCP adds port information (destination port 80).

3. **Network Layer**:

   - IP determines destination (203.0.113.50) is on different network.
   - Adds IP header with source (192.168.1.10) and destination IPs.

4. **Data Link Layer**:

   - Computer checks ARP table for router's MAC address.
   - Creates Ethernet frame with router's MAC as destination.

5. **Physical Layer**: Converts frame to electrical signals.

6. **At the Router**:

   - Receives frame, strips Ethernet header.
   - Examines IP packet, consults routing table.
   - Forwards packet toward destination network.
   - May pass through multiple routers (hops).

7. **At Destination Network**:
   - Final router delivers packet to server's network.
   - Switch forwards frame to correct server port.
   - Server processes request and sends response back.

---

## **Summary & Key Takeaways**

📌 **The Big Picture**:

- **Switches** are like smart postal sorting offices - they learn where everyone lives (MAC addresses) and deliver mail (frames) to the right mailbox (port).
- **Routers** are like GPS navigation systems - they find the best path (route) between different neighborhoods (networks) using addresses (IP addresses).
- **The Internet** is like a massive highway system with interchanges (routers), local roads (switches), and traffic rules (protocols).
- **Network Layers** are like a shipping company - each layer adds its own label/packaging, and the receiving end removes each layer to get to the original message.

**Memory Device - "All People Seem To Need Data Processing"**:

- **A**pplication (Layer 7) - User applications
- **P**resentation (Layer 6) - Data formatting
- **S**ession (Layer 5) - Session management
- **T**ransport (Layer 4) - Reliable delivery
- **N**etwork (Layer 3) - Routing
- **D**ata Link (Layer 2) - Local delivery
- **P**hysical (Layer 1) - Physical transmission
