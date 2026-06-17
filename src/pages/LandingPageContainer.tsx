import { useNavigate } from 'react-router-dom';
import { LandingPage } from '../components/LandingPage';
import { useProperties } from '../hooks/useProperties';

/**
 * Route container for /. Feeds the landing page a small set of real featured
 * listings and wires its search CTAs to the /search route.
 */
export const LandingPageContainer = () => {
  const navigate = useNavigate();
  const { properties } = useProperties({ take: 6 });

  const goToSearch = (city?: string, query?: string) => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (query) params.set('q', query);
    const qs = params.toString();
    navigate(qs ? `/search?${qs}` : '/search');
  };

  return (
    <LandingPage
      featuredProperties={properties}
      onStartSearching={goToSearch}
      onSelectProperty={(id) => navigate(`/property/${id}`)}
    />
  );
};
