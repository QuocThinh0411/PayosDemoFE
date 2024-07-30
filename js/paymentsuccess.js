function taoLinkThanhToan() {
    let urlParams = new URLSearchParams(window.location.search);

        var code = urlParams.get('code');
    
        var id = urlParams.get('id');
        
        var status = urlParams.get('status');
        
        var orderCode = urlParams.get('orderCode');
        

        // GỌi api http://localhost:8080/order/orderCode để lấy thông tin, thông tin response kiểu:

        // {
        //     "data": {
        //         "id": "c89e08619a164e72999a48ef08547712",
        //         "orderCode": 19639014,
        //         "amount": 2000,
        //         "amountPaid": 2000,
        //         "amountRemaining": 0,
        //         "status": "PAID",
        //         "createdAt": "2024-07-28T17:00:15+07:00",
        //         "transactions": [
        //             {
        //                 "reference": "FT24211FYS45",
        //                 "amount": 2000,
        //                 "accountNumber": "0372399889",
        //                 "description": "CSWJFDIINX3 19639014",
        //                 "transactionDateTime": "2024-07-28T17:00:00+07:00",
        //                 "virtualAccountName": null,
        //                 "virtualAccountNumber": "CAS0372399889",
        //                 "counterAccountBankId": null,
        //                 "counterAccountBankName": null,
        //                 "counterAccountName": null,
        //                 "counterAccountNumber": null
        //             }
        //         ],
        //         "cancellationReason": null,
        //         "canceledAt": null
        //     },
        //     "error": 0,
        //     "message": "ok"
        // }
        //  dùng signature mình đã lưu để compare với data trả về, nếu oke thì tiến hành thanh toán
        var currentuser = getCurrentUser();
    		currentuser.donhang.forEach(item => {
          if (orderCode == item.orderCode) {
            item.tinhTrang ="D"
          }
        });
		currentuser.products = [];
		capNhatMoiThu();
		addAlertBox('Các sản phẩm đã được gửi vào đơn hàng và chờ xử lý.', '#17c671', '#fff', 4000);
}

