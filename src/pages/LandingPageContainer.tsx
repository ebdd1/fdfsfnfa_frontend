import { useNavigate } from 'react-router-dom';
import { LandingPage } from '../components/LandingPage';
import { Footer } from '../components/Footer';
import { useProperties } from '../hooks/useProperties';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Route container for /.
 * Feeds real featured listings from API and wires search CTAs to /search route.
 * Includes Footer for full page experience.
 */
export const LandingPageContainer = () => {
  const navigate = useNavigate();
  const { properties } = useProperties({ take: 6 });
  const siteName = useSettingsStore((s) => s.settings.site_name) || 'KostFind';

  const goToSearch = (city?: string, query?: string) => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (query) params.set('q', query);
    const qs = params.toString();
    navigate(qs ? `/search?${qs}` : '/search');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <LandingPage
          siteName={siteName}
          featuredProperties={properties}
          onStartSearching={goToSearch}
        />
      </div>
      <Footer />
    </div>
  );
};
