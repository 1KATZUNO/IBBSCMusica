import CantosManager from './CantosManager';
import MusiciansManager from './MusiciansManager';
import ProgramTypesManager from './ProgramTypesManager';
import DirectorsManager from './DirectorsManager';

export default function AdminPanel({ activePanel, showNotif }) {
  switch (activePanel) {
    case 'cantos':
      return <CantosManager showNotif={showNotif} />;
    case 'musicians':
      return <MusiciansManager showNotif={showNotif} />;
    case 'types':
      return <ProgramTypesManager showNotif={showNotif} />;
    case 'directors':
      return <DirectorsManager showNotif={showNotif} />;
    default:
      return null;
  }
}
