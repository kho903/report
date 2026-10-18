import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";

const API_URL = "http://localhost:8080/api/products";
const COLORS = ["빨강", "파랑", "초록", "노랑"];

function App() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [options, setOptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadProducts() {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch {
      setError(
        "상품목록을 불러오지 못했습니다. 백엔드와 DB 연결을 확인해주세요.",
      );
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleOptionChange(event) {
    const { value, checked } = event.target;
    setOptions((current) =>
      checked
        ? [...current, value]
        : current.filter((option) => option !== value),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await axios.post(API_URL, {
        name,
        price: Number(price),
        quantity: Number(quantity),
        options: COLORS.filter((color) => options.includes(color)).join("/"),
      });

      setName("");
      setPrice("");
      setQuantity("");
      setOptions([]);
      await loadProducts();
    } catch {
      setError("상품등록에 실패했습니다. 백엔드와 DB 연결을 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          <h2 className="mb-3">상품등록</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Table variant="dark" bordered className="align-middle mb-0">
              <tbody>
                <tr>
                  <th scope="row" className="col-3">
                    <Form.Label htmlFor="product-name" className="mb-0">
                      상품명
                    </Form.Label>
                  </th>
                  <td>
                    <Form.Control
                      id="product-name"
                      type="text"
                      className="w-50"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      maxLength={255}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <Form.Label htmlFor="product-price" className="mb-0">
                      가격
                    </Form.Label>
                  </th>
                  <td>
                    <Form.Control
                      id="product-price"
                      type="number"
                      className="w-50"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      min={0}
                      max={2147483647}
                      step={1}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <Form.Label htmlFor="product-quantity" className="mb-0">
                      수량
                    </Form.Label>
                  </th>
                  <td>
                    <Form.Control
                      id="product-quantity"
                      type="number"
                      className="w-50"
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      min={0}
                      max={2147483647}
                      step={1}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">옵션</th>
                  <td>
                    {COLORS.map((color, index) => (
                      <Form.Check
                        inline
                        key={color}
                        id={`option-${index}`}
                        type="checkbox"
                        label={color}
                        value={color}
                        checked={options.includes(color)}
                        onChange={handleOptionChange}
                      />
                    ))}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <Button
                      type="submit"
                      variant="light"
                      disabled={isSubmitting}
                    >
                      전송하기
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Form>

          <h2 className="mt-5 mb-3">상품목록</h2>
          <Table responsive>
            <thead>
              <tr>
                <th scope="col">상품명</th>
                <th scope="col">가격</th>
                <th scope="col">수량</th>
                <th scope="col">옵션</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.options}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    등록된 상품이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
