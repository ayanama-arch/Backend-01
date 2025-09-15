# Data Representation in Computers

### Binary Data

- **Binary** uses only two digits: `0` and `1`.
- Computers work with binary because electrical circuits have two states: **ON (1)** and **OFF (0)**.

---

## Binary Numbers (Base-2)

- Base = 2 → only digits allowed: `0`, `1`.
- **8 bits = 1 byte**

### Converting Binary → Decimal

Each binary digit (bit) has a place value = `2^n`, where `n` starts from 0 (rightmost bit).

Example:
Binary `01011`

```
(From right to left)
1 × 2^0 = 1
1 × 2^1 = 2
0 × 2^2 = 0
1 × 2^3 = 8
0 × 2^4 = 0
-----------------
Total = 11 (decimal)
```

---

## Hexadecimal Numbers (Base-16)

- Base = 16 → digits allowed: `0–9` and `A–F`

  - A = 10, B = 11, …, F = 15

- Notation: Prefix `0x` is often used (example: `0x1F`). This prefix is **just for representation**, not part of the value.

### Hexadecimal → Decimal

Multiply each digit by `16^n` (where `n` is the position from right, starting at 0).

Example: `0x2F`

```
F × 16^0 = 15 × 1 = 15
2 × 16^1 = 2 × 16 = 32
---------------------
Total = 47 (decimal)
```

---

### Hexadecimal ↔ Binary

- Each hex digit = exactly **4 binary bits** (a nibble).
- Quick mapping:

  ```
  0 = 0000   4 = 0100   8 = 1000   C = 1100
  1 = 0001   5 = 0101   9 = 1001   D = 1101
  2 = 0010   6 = 0110   A = 1010   E = 1110
  3 = 0011   7 = 0111   B = 1011   F = 1111
  ```

Example: `0x3A`

```
3 = 0011
A = 1010
-------------
Binary = 00111010
```

---

✅ With this, you can fluently move between binary, decimal, and hexadecimal—the holy trinity of computer number systems.
