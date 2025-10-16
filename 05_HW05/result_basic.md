Homework assignment 05

- Thực hiện mint, burn, liquidity stablecoin như demo, ghi lại Txhash vào file result => đạt mức điểm B
- Để đạt mức điểm A, thực hiện thêm 1 trong 2 yêu cầu nâng cao sau ( push phần code thay đổi lên repo, ghi lại kết quả Txhash vào file result )
1. Giảm rủi ro thanh lý (liquidation risk): 
- Vấn đề: Nếu giá trị tài sản thế chấp giảm dưới ngưỡng, người dùng mất toàn bộ giá trị dư thừa (50% collateral), và giá trị này được chuyển hết cho người thanh lý (liquidator). Điều này gây thiệt hại lớn cho người dùng.
=> Yêu cầu cải thiện: Giới hạn phần thưởng cho người thanh lý ở mức tối đa 2% giá trị dư thừa, phần còn lại trả lại cho chủ sở hữu ban đầu.
2. Thêm phí cho nhà phát triển (developer fee):
- Vấn đề: Hiện tại, hệ thống không trả phí cho nhà phát triển, chỉ người thanh lý kiếm được tiền.
=> Yêu cầu cải thiện: Thêm một khoản phí nhỏ, ví dụ 0.1%, áp dụng khi thực hiện các hành động mint, burn, hoặc liquidate để hỗ trợ nhà phát triển.


Result

A. Phần cơ bản

# S1: Mint Oracle's NFT
```
9da9b3e96804987b7e7d5b7dec92a74620a65ee952cf7d9c81d3b7f22915744d
```

# S2: Deploy Oracle , with ADA price = 1$
```
102cf8da5e8b0bc84b1b909152b6c6fd0d27539098db0f07429c160e033f7c54
```

# S3: Owner deloy Scripts, minimum ratio = 150%
```
c259692f12fb3f4d8a34cf36a0c3d77e014bde631a792482dbd78e6931e9ef67
```

# S4: User 1 mint 10 stablecoin , collateral 15 ADA
```
6e9da8dc6c35786673c52cf7af939e3e7679a4e69568084dbfc1c82222943440
```

# S5: User 1 burn 10 stablecoin, no change ADA price
```
010a73ce31cd8c99a72c97ad264e048180f3f3832222fc0fe1956e74276c0c39
```
# User 1 mint 10 stablecoin ( collateral 15 ADA) , User 2 mint 50 stablecoint (collateral 100 ADA) , Ada price down to 0.9, then User2 liquite 10 stablecoin of user 1

# S6: User 1 mint 10 stablecoin ( collateral 15 ADA)
```
2d2aabc760e5013739913cefc10834880c1cf31c5d29523df65beace35200d9b
```

# S7: User 2 mint 50 stablecoint (collateral 100 ADA)
```
cb3a54385b78997d677d1bac41bbddba704cd05f5ab428dd9fff4028372a199b
```

# S8: Update Ada Price to 0.9$
```
8de744ec05421638355beca0ca9fe6ccb56b2ffb7d86eddd2d9149b63070ee13
```

# S9: User 2 liqute colateral UTxO of user 1
```
d887b24211be35d0527f446b670e22edb1a745b4330295ac8894b24014803821
```
 
 