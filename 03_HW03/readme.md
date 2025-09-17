# ----------- Guideline how to run code -------

# b1: create a new folder, and initialize a Node.js project
npm init

# b2: install the typescript and Mesh package, then follow the guildline to fix bugs
npm install --dev typescript && npm install @meshsdk/core

# b3: initialize Typescript
npx tsc --init

# b4: open the tsconfig.json file and define the following configurations
{
  ...
  "target": "ESNext",
  "module": "ESNext",
  "moduleResolution": "Node",
  "outDir": "dist",
  ...
}

# b5: open the package.json file add the following configurations

{
  ...
  "type": "module",
  "scripts": {
    "start": "tsc && node ./dist/main.js"
  }
  ...
}

# ------- Khởi tạo đã xong, giờ bạn có thể chạy code dự án ----------
# Để chạy từng file, lệnh được khai báo trong package.json
# cài compiler tsx thay cho ts-node( xài lỗi tức vl)
npm install tsx

npm run start01
npm run start02


# -------------------- Home assignment 3 ---------------
# Yêu cầu
Bài 1 – Mint 500 Token Native:
- Yêu cầu: 
+ Mint token trên Cardano bằng MeshJS hoặc Lucid evolution. Token có tên của bạn và số lượng tùy ý. Nhưng sau khi mint hãy gửi 500 token đó đến ví của sau: addr_test1qpuexzns2ze8g5csu30mnnk6gf2vx3kpwz2vcgvjsv7q3dr4mvw6eahqha5vj295mm0ugphljpesxaszfcff5hq9w63qrh0623

- Submit:
+ Source code (Git repo).
+ File readme.md có log chạy và TxHash chứng minh giao dịch thành công.

# Kết quả bài 1
Policy ID: 3cac0003047ca9696399c9eb232a958d801fa0c71de7c1c8b3c22756
Asset ID: 3cac0003047ca9696399c9eb232a958d801fa0c71de7c1c8b3c227564e677579656e5472756e67486965753033
TxHash: 33cc92342c928019b68af7332933fd2452f37670301729b8470ff1af2d4635a7

# Yêu cầu
Bài 2 – NFT CIP-68 với Metadata Mutable:
- Yêu cầu:
+ Mint một NFT theo chuẩn CIP-68.
+ Đặt tên NFT: "C2VN-[tên của bạn]".
+ Metadata ban đầu: { "level": 1 }.
+ Gửi User NFT (label 222) cho addr_test1qpuexzns2ze8g5csu30mnnk6gf2vx3kpwz2vcgvjsv7q3dr4mvw6eahqha5vj295mm0ugphljpesxaszfcff5hq9w63qrh0623

- Thực hiện 1 lần cập nhật metadata:
+ Thay "level": 1 thành "level": 2.

- Submit:
+ Source code (Git repo).
+ File readme.md có log chạy và TxHash chứng minh giao dịch thành công của 2 transaction
(a) Mint NFT.
(b) Update metadata. 

# Kết quả bài 2
