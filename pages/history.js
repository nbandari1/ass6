import { useAtom } from 'jotai';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { searchHistoryAtom } from '@/store';
import { useRouter } from 'next/router';
import { removeFromHistory } from '@/lib/userData';

export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  async function historyClicked(queryString) {
    await router.push(`/artwork?${queryString}`);
  }

  async function removeHistoryClicked(index) {
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(index, 1);
    setSearchHistory(updatedHistory);
    await removeFromHistory(searchHistory[index]);
  }

  return (
    <>
      {searchHistory.length > 0 ? (
        <ListGroup>
          {searchHistory.map((historyItem, index) => (
            <ListGroup.Item key={index}>
              <div>
                {Object.entries(historyItem).map(([key, value]) => (
                  <span key={key}>
                    <strong>{key}: </strong>
                    {value}&nbsp;
                  </span>
                ))}
              </div>
              <Button variant="danger" size="sm" onClick={() => removeHistoryClicked(index)}>
                Remove
              </Button>
              <Button className="ms-2" onClick={() => historyClicked(historyItem)}>
                View
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for some artwork.
          </Card.Body>
        </Card>
      )}
    </>
  );
}
