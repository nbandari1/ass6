// RouteGuard.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { isAuthenticated } from '../lib/authenticate';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '../store';
import { getFavourites, getHistory } from '../lib/userData';

const PUBLIC_PATHS = ['/login', '/', '/_error'];

export default function RouteGuard(props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);
  const [, setFavouritesList] = useAtom(favouritesAtom);

  useEffect(() => {
    authCheck(router.pathname);

    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  async function updateAtoms() {
    if (isAuthenticated()) {
      const favourites = await getFavourites();
      setFavouritesList(favourites);

      const history = await getHistory();
      setSearchHistory(history);
    }
  }

  async function authCheck(url) {
    const path = url.split('?')[0];
    if (!PUBLIC_PATHS.includes(path)) {
      if (!isAuthenticated()) {
        setAuthorized(false);
        router.push('/login');
      } else {
        setAuthorized(true);
        await updateAtoms();
      }
    }
  }

  return <>{authorized && props.children}</>;
}
