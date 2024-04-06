import { Col, Row, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { addToHistory } from '@/lib/userData';

export default function AdvancedSearch() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  async function submitForm(data) {
    const queryString = buildQueryString(data);
    setSearchHistory(current => [...current, queryString]);
    await addToHistory(queryString);
    router.push(`/artwork?${queryString}`);
  }

  function buildQueryString(data) {
    let queryString = 'title=true';
    if (data.q) queryString += `&q=${data.q}`;
    if (data.searchBy) queryString += `&searchBy=${data.searchBy}`;
    if (data.geoLocation) queryString += `&geoLocation=${data.geoLocation}`;
    if (data.medium) queryString += `&medium=${data.medium}`;
    if (data.isOnView) queryString += `&isOnView=${data.isOnView}`;
    if (data.isHighlight) queryString += `&isHighlight=${data.isHighlight}`;
    return queryString;
  }

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Search Query</Form.Label>
            <Form.Control type="text" {...register("q")} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Search By</Form.Label>
            <Form.Select {...register("searchBy")}>
              <option value="title">Title</option>
              <option value="tags">Tags</option>
              <option value="artistOrCulture">Artist or Culture</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control type="text" {...register("geoLocation")} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control type="text" {...register("medium")} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Check type="checkbox" label="Highlighted" {...register("isHighlight")} />
          <Form.Check type="checkbox" label="Currently on View" {...register("isOnView")} />
        </Col>
      </Row>
      <Button type="submit">Search</Button>
    </Form>
  );
}
