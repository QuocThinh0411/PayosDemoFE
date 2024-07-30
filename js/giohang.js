var currentuser; // user hiện tại, biến toàn cục
window.onload = function () {
	khoiTao();


	// autocomplete cho khung tim kiem
	autocomplete(document.getElementById('search-box'), list_products);

	// thêm tags (từ khóa) vào khung tìm kiếm
	 var tags = ["Conan", "Cảm xúc", "Thảm họa", "Harry Potter", "Bố già"];
	for (var t of tags) addTags(t, "index.html?search=" + t)
	currentuser = getCurrentUser();
	addProductToTable(currentuser);
	updateOrderStatus();
}
function updateOrderStatus() {

    let urlParams = new URLSearchParams(window.location.search);

    let status = urlParams.get('status');
    let orderCode = urlParams.get('orderCode');

	if (orderCode != null && status != null ) {
		currentuser.donhang.forEach(item => {
			console.log("ordercode"+ item.orderCode);
			console.log("ordercode"+ orderCode);
			if (orderCode == item.orderCode) {
	
				switch (status) {
					case "CANCELLED":
						console.log("is CANCELLED " + item.tinhTrang);
	
						item.tinhTrang = "Đã hủy";
						break;
					case "PROCESSING":
						item.tinhTrang = "Đang xử lý";
						break;
					case "PAID":
						item.tinhTrang = "Đã thanh toán";
						break;
					case "PENDING":
						item.tinhTrang = "Chờ thanh toán";
						break;
					default:
						console.warn(`Unknown status: ${status}`);
				}
			}
		});
		capNhatMoiThu();
	}

    
}

function addProductToTable(user) {
	var table = document.getElementsByClassName('listSanPham')[0];

	var s = `
		<tbody>
			<tr>
				<th>STT</th>
				<th>Sản phẩm</th>
				<th>Giá</th>
				<th>Số lượng</th>
				<th>Thành tiền</th>
				<th>Thời gian</th>
				<th>Xóa</th>
			</tr>`;

	if (!user) {
		s += `
			<tr>
				<td colspan="7"> 
					<h1 style="color:red; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
						Bạn chưa đăng nhập !!
					</h1> 
				</td>
			</tr>
		`;
		table.innerHTML = s;
		return;
	} else if (user.products.length == 0) {
		s += `
			<tr>
				<td colspan="7"> 
					<h1 style="color:green; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
						Giỏ hàng trống !!
					</h1> 
				</td>
			</tr>
		`;
		table.innerHTML = s;
		return;
	}

	var totalPrice = 0;
	for (var i = 0; i < user.products.length; i++) {
		var masp = user.products[i].ma;
		var soluongSp = user.products[i].soluong;
		var p = timKiemTheoMa(list_products, masp);
		var price = (p.promo.name == 'giareonline' ? p.promo.value : p.price);
		var thoigian = new Date(user.products[i].date).toLocaleString();
		var thanhtien = stringToNum(price) * soluongSp;

		s += `
			<tr>
				<td>` + (i + 1) + `</td>
				<td class="noPadding imgHide">
					<a target="_blank" href="chitietsanpham.html?` + p.name.split(' ').join('-') + `" title="Xem chi tiết">
						` + p.name + `
						<img src="` + p.img + `">
					</a>
				</td>
				<td class="alignRight">` + price + ` ₫</td>
				<td class="soluong" >
					<button onclick="giamSoLuong('` + masp + `')"><i class="fa fa-minus"></i></button>
					<input size="1" onchange="capNhatSoLuongFromInput(this, '` + masp + `')" value=` + soluongSp + `>
					<button onclick="tangSoLuong('` + masp + `')"><i class="fa fa-plus"></i></button>
				</td>
				<td class="alignRight">` + numToString(thanhtien) + ` ₫</td>
				<td style="text-align: center" >` + thoigian + `</td>
				<td class="noPadding"> <i class="fa fa-trash" onclick="xoaSanPhamTrongGioHang(` + i + `)"></i> </td>
			</tr>
		`;
		// Chú ý nháy cho đúng ở giamsoluong, tangsoluong
		totalPrice += thanhtien;
	}

	s += `
			<tr style="font-weight:bold; text-align:center">
				<td colspan="4">TỔNG TIỀN: </td>
				<td class="alignRight">` + numToString(totalPrice) + ` ₫</td>
				<td class="thanhtoan" onclick="thanhToan()"> Thanh Toán </td>
				<td class="xoaHet" onclick="xoaHet()"> Xóa hết </td>
			</tr>
		</tbody>
	`;

	table.innerHTML = s;
}

function xoaSanPhamTrongGioHang(i) {
	if (window.confirm('Xác nhận hủy mua')) {
		currentuser.products.splice(i, 1);
		capNhatMoiThu();
	}
}
function thanhToan() {
	var currentuser = getCurrentUser();

	if (currentuser.off) {
		alert('Tài khoản của bạn hiện đang bị khóa nên không thể mua hàng!');
		addAlertBox('Tài khoản của bạn đã bị khóa bởi Admin.', '#aa0000', '#fff', 10000);
		return;
	}

	if (!currentuser.products.length) {
		addAlertBox('Không có mặt hàng nào cần thanh toán !!', '#ffb400', '#fff', 2000);
		return;
	}
	if (window.confirm('Thanh toán giỏ hàng ?')) {
		// process();
		taoLinkThanhToan();
		
		// .then(url => {
		// 	if (url) {
				 
		
	
		// }).catch(error => {
		// 	console.error('Error during payment process:', error.message);
		// 	addAlertBox('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau!', '#ff0000', '#fff', 4000);
		// });
	}
}




function taoLinkThanhToan() {
    var c_user = getCurrentUser();
    const currentDomain = window.location.hostname;
    const currentPort = window.location.port;
    const fullDomain = currentPort ? `${currentDomain}:${currentPort}` : currentDomain;

    var orderidRandom = getRandomOrderId();
    const orderData = {
        description: '' + orderidRandom,
        buyerName: c_user.ho + ' ' + c_user.ten,
        buyerEmail: c_user.email,
		orderCode:orderidRandom,

        cancelUrl: fullDomain + "/paymentfail.html",
        returnUrl: fullDomain + "/paymentsuccess.html"
    };
// https://www.facebook.com/?code=00&id=c89e08619a164e72999a48ef08547712&cancel=false&status=PAID&orderCode=19639014
    var items = [];
    var totalAmount = 0;
    c_user.products.forEach(product => {
        var sanpham = getProduct(product.ma);
        items.push({
            name: product.ma,
            quantity: product.soluong,
            price: convertPriceStringToInt(sanpham.price)
        });
        totalAmount += convertPriceStringToInt(sanpham.price) * product.soluong;
    });

    orderData.items = items;
    orderData.amount = totalAmount;



    var api = "http://localhost:8080/order/create"
    fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(response => {
        console.log('Payment link created:', response.data.checkoutUrl);
        if (response.error === 0) {
			currentuser.donhang.push({
				"sp": currentuser.products,
				"ngaymua": new Date(),
				"tinhTrang": 'Đang chờ xử lý',
				"orderCode": response.data.orderCode

			});
			currentuser.products = [];
			capNhatMoiThu();
			addAlertBox('Các sản phẩm đã được gửi vào đơn hàng và chờ xử lý.', '#17c671', '#fff', 4000);

            window.location.href = response.data.checkoutUrl; // Chuyển hướng đến URL thanh toán
        } else {
            console.error('Failed to create payment link:', response.message);
            addAlertBox('Không thể tạo liên kết thanh toán. Vui lòng thử lại sau!', '#ff0000', '#fff', 4000);
        }
    })
    .catch(error => {
        console.error('Error creating payment link:', error.message);
        addAlertBox('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau!', '#ff0000', '#fff', 4000);
    });
}

function xoaHet() {
	if (currentuser.products.length) {
		if (window.confirm('Bạn có chắc chắn muốn xóa hết sản phẩm trong giỏ !!')) {
			currentuser.products = [];
			capNhatMoiThu();
		}
	}
}

// Cập nhật số lượng lúc nhập số lượng vào input
function capNhatSoLuongFromInput(inp, masp) {
	var soLuongMoi = Number(inp.value);
	if (!soLuongMoi || soLuongMoi <= 0) soLuongMoi = 1;

	for (var p of currentuser.products) {
		if (p.ma == masp) {
			p.soluong = soLuongMoi;
		}
	}

	capNhatMoiThu();
}

function tangSoLuong(masp) {
	for (var p of currentuser.products) {
		if (p.ma == masp) {
			p.soluong++;
		}
	}

	capNhatMoiThu();
}

function giamSoLuong(masp) {
	for (var p of currentuser.products) {
		if (p.ma == masp) {
			if (p.soluong > 1) {
				p.soluong--;
			} else {
				return;
			}
		}
	}

	capNhatMoiThu();
}

function capNhatMoiThu() { // Mọi thứ
	animateCartNumber();

	// cập nhật danh sách sản phẩm trong localstorage
	setCurrentUser(currentuser);
	updateListUser(currentuser);

	// cập nhật danh sách sản phẩm ở table
	addProductToTable(currentuser);

	// Cập nhật trên header
	capNhat_ThongTin_CurrentUser();
}
