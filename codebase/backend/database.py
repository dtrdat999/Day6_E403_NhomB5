import json
import os
from copy import deepcopy
from pathlib import Path
from typing import Any


DB_PATH = Path(os.getenv("MONI_DB_PATH", Path(__file__).with_name("transaction_db.json")))


mock_transactions = [
  {
    "id": "1",
    "date": "2026-06-01",
    "amount": 65000,
    "type": "expense",
    "description": "Chuyển tiền ăn trưa bún chả",
    "recipient": "Nguyễn Minh Anh",
    "category": ""
  },
  {
    "id": "2",
    "date": "2026-06-01",
    "amount": 42000,
    "type": "expense",
    "description": "Chia tiền taxi đi học",
    "recipient": "Trần Hoàng Nam",
    "category": ""
  },
  {
    "id": "3",
    "date": "2026-06-02",
    "amount": 156000,
    "type": "expense",
    "description": "Mua sữa, bánh mì và đồ ăn sáng",
    "recipient": "WinMart",
    "category": ""
  },
  {
    "id": "4",
    "date": "2026-06-02",
    "amount": 235000,
    "type": "expense",
    "description": "Chuyển tiền mua hộ mỹ phẩm",
    "recipient": "Phạm Thu Hà",
    "category": ""
  },
  {
    "id": "5",
    "date": "2026-06-03",
    "amount": 38000,
    "type": "expense",
    "description": "Thanh toán chuyến xe đến trường",
    "recipient": "GrabBike",
    "category": ""
  },
  {
    "id": "6",
    "date": "2026-06-03",
    "amount": 95000,
    "type": "expense",
    "description": "Chuyển tiền vé xem phim",
    "recipient": "Lê Quang Huy",
    "category": ""
  },
  {
    "id": "7",
    "date": "2026-06-04",
    "amount": 49000,
    "type": "expense",
    "description": "Thanh toán Google Pro tháng này",
    "recipient": "Google Play",
    "category": ""
  },
  {
    "id": "8",
    "date": "2026-06-04",
    "amount": 182000,
    "type": "expense",
    "description": "Mua thuốc cảm và vitamin C",
    "recipient": "Nhà thuốc Long Châu",
    "category": ""
  },
  {
    "id": "9",
    "date": "2026-06-05",
    "amount": 300000,
    "type": "expense",
    "description": "Chuyển tiền mua quà sinh nhật bạn",
    "recipient": "Bùi Lan Anh",
    "category": ""
  },
  {
    "id": "10",
    "date": "2026-06-05",
    "amount": 57000,
    "type": "expense",
    "description": "Mua nước uống và snack",
    "recipient": "Circle K",
    "category": ""
  },
  {
    "id": "11",
    "date": "2026-06-06",
    "amount": 675000,
    "type": "expense",
    "description": "Thanh toán hóa đơn điện tháng 5",
    "recipient": "Điện lực Hà Nội",
    "category": ""
  },
  {
    "id": "12",
    "date": "2026-06-06",
    "amount": 3500000,
    "type": "expense",
    "description": "Thanh toán tiền thuê phòng tháng 6",
    "recipient": "Chủ nhà - Cô Hạnh",
    "category": ""
  },
  {
    "id": "13",
    "date": "2026-06-07",
    "amount": 1200000,
    "type": "expense",
    "description": "Chuyển tiền sinh hoạt gia đình",
    "recipient": "Mẹ",
    "category": ""
  },
  {
    "id": "14",
    "date": "2026-06-07",
    "amount": 278000,
    "type": "expense",
    "description": "Mua sách tiếng Anh và bút highlight",
    "recipient": "Fahasa",
    "category": ""
  },
  {
    "id": "15",
    "date": "2026-06-08",
    "amount": 50000,
    "type": "expense",
    "description": "Ủng hộ chiến dịch từ thiện trẻ em vùng cao",
    "recipient": "MoMo Heo Đất",
    "category": ""
  },
  {
    "id": "16",
    "date": "2026-06-08",
    "amount": 180000,
    "type": "expense",
    "description": "Chuyển tiền góp mua đồ ăn liên hoan",
    "recipient": "Đỗ Minh Quân",
    "category": ""
  },
  {
    "id": "17",
    "date": "2026-06-09",
    "amount": 100000,
    "type": "expense",
    "description": "Nạp tiền vé xe bus tháng này",
    "recipient": "VinBus",
    "category": ""
  },
  {
    "id": "18",
    "date": "2026-06-09",
    "amount": 458000,
    "type": "expense",
    "description": "Mua áo sơ mi và phụ kiện điện thoại",
    "recipient": "Shopee",
    "category": ""
  },
  {
    "id": "19",
    "date": "2026-06-10",
    "amount": 326000,
    "type": "expense",
    "description": "Mua kem chống nắng và tẩy trang",
    "recipient": "Hasaki",
    "category": ""
  },
  {
    "id": "20",
    "date": "2026-06-10",
    "amount": 460000,
    "type": "expense",
    "description": "Thanh toán phí xét nghiệm sức khỏe",
    "recipient": "Bệnh viện Medlatec",
    "category": ""
  },
  {
    "id": "21",
    "date": "2026-06-11",
    "amount": 250000,
    "type": "expense",
    "description": "Chuyển tiền mua sách tham khảo",
    "recipient": "Em trai",
    "category": ""
  },
  {
    "id": "22",
    "date": "2026-06-11",
    "amount": 220000,
    "type": "expense",
    "description": "Thanh toán hóa đơn internet gia đình",
    "recipient": "Viettel",
    "category": ""
  },
  {
    "id": "23",
    "date": "2026-06-12",
    "amount": 1000000,
    "type": "expense",
    "description": "Tự động chuyển tiền vào tài khoản tiết kiệm",
    "recipient": "Ngân hàng số",
    "category": ""
  },
  {
    "id": "24",
    "date": "2026-06-12",
    "amount": 75000,
    "type": "expense",
    "description": "Trả tiền cà phê học nhóm",
    "recipient": "Nguyễn Bảo Ngọc",
    "category": ""
  },
  {
    "id": "25",
    "date": "2026-06-13",
    "amount": 210000,
    "type": "expense",
    "description": "Mua vé xem phim cuối tuần",
    "recipient": "CGV Cinemas",
    "category": ""
  },
  {
    "id": "26",
    "date": "2026-06-13",
    "amount": 52000,
    "type": "expense",
    "description": "Thanh toán chuyến xe về nhà",
    "recipient": "Gojek",
    "category": ""
  },
  {
    "id": "27",
    "date": "2026-06-14",
    "amount": 342000,
    "type": "expense",
    "description": "Mua rau, thịt và đồ dùng bếp",
    "recipient": "Bách Hóa Xanh",
    "category": ""
  },
  {
    "id": "28",
    "date": "2026-06-14",
    "amount": 190000,
    "type": "expense",
    "description": "Chuyển tiền mua hộ son môi",
    "recipient": "Nguyễn Hải Yến",
    "category": ""
  },
  {
    "id": "29",
    "date": "2026-06-15",
    "amount": 550000,
    "type": "expense",
    "description": "Đóng phí tập gym tháng này",
    "recipient": "Phòng gym Fit24",
    "category": ""
  },
  {
    "id": "30",
    "date": "2026-06-15",
    "amount": 200000,
    "type": "expense",
    "description": "Đóng tiền liên hoan lớp",
    "recipient": "Quỹ lớp BA64",
    "category": ""
  },
  {
    "id": "31",
    "date": "2026-06-16",
    "amount": 285000,
    "type": "expense",
    "description": "Thanh toán chuyến taxi đi sân bay",
    "recipient": "Taxi Xanh SM",
    "category": ""
  },
  {
    "id": "32",
    "date": "2026-06-16",
    "amount": 2000000,
    "type": "expense",
    "description": "Nạp tiền đầu tư cổ phiếu",
    "recipient": "Sàn chứng khoán",
    "category": ""
  },
  {
    "id": "33",
    "date": "2026-06-17",
    "amount": 650000,
    "type": "expense",
    "description": "Chuyển tiền mua vé concert",
    "recipient": "Nguyễn Phương Linh",
    "category": ""
  },
  {
    "id": "34",
    "date": "2026-06-18",
    "amount": 198000,
    "type": "expense",
    "description": "Mua giáo trình và sổ tay học tập",
    "recipient": "Nhà sách Phương Nam",
    "category": ""
  },
  {
    "id": "35",
    "date": "2026-06-18",
    "amount": 350000,
    "type": "expense",
    "description": "Thanh toán sửa vòi nước trong phòng",
    "recipient": "Thợ sửa điện nước",
    "category": ""
  }
]

mock_user = {
  "id": "user_01",
  "name": "Khách hàng MoMo",
  "balance": 5000000
}


def _read_json_db() -> list[dict[str, Any]]:
  if not DB_PATH.exists():
    return []

  try:
    with DB_PATH.open("r", encoding="utf-8") as file:
      data = json.load(file)
  except (OSError, json.JSONDecodeError):
    return []

  return data if isinstance(data, list) else []


def _write_json_db(transactions: list[dict[str, Any]]) -> None:
  with DB_PATH.open("w", encoding="utf-8") as file:
    json.dump(transactions, file, ensure_ascii=False, indent=2)


def get_transactions() -> list[dict[str, Any]]:
  return deepcopy(_read_json_db())


def sync_transactions(seed_transactions: list[dict[str, Any]]) -> list[dict[str, Any]]:
  stored_transactions = _read_json_db()

  if not stored_transactions:
    synced = deepcopy(seed_transactions)
    _write_json_db(synced)
    return synced

  stored_by_id = {
    tx.get("id"): tx
    for tx in stored_transactions
    if tx.get("id") is not None
  }
  merged_transactions: list[dict[str, Any]] = []

  for seed_tx in seed_transactions:
    tx_id = seed_tx.get("id")
    if tx_id in stored_by_id:
      merged_tx = deepcopy(seed_tx)
      merged_tx.update(stored_by_id[tx_id])
      merged_transactions.append(merged_tx)
    else:
      merged_transactions.append(deepcopy(seed_tx))

  seed_ids = {tx.get("id") for tx in seed_transactions}
  for stored_tx in stored_transactions:
    if stored_tx.get("id") not in seed_ids:
      merged_transactions.append(deepcopy(stored_tx))

  _write_json_db(merged_transactions)
  return merged_transactions


def update_transaction(transaction_id: str, updates: dict[str, Any]) -> dict[str, Any] | None:
  transactions = _read_json_db()

  for tx in transactions:
    if tx.get("id") == transaction_id:
      tx.update(updates)
      _write_json_db(transactions)
      return deepcopy(tx)

  return None
