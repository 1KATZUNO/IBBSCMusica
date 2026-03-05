import CantosManager from './CantosManager';
import MusiciansManager from './MusiciansManager';
import ProgramTypesManager from './ProgramTypesManager';
import DirectorsManager from './DirectorsManager';
import ServidoresManager from './ServidoresManager';
import MembersManager from './MembersManager';
import InvitationsManager from './InvitationsManager';
import EnsayosManager from './EnsayosManager';

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
    case 'servidores':
      return <ServidoresManager showNotif={showNotif} />;
    case 'members':
      return <MembersManager showNotif={showNotif} />;
    case 'invitations':
      return <InvitationsManager showNotif={showNotif} />;
    case 'ensayos':
      return <EnsayosManager showNotif={showNotif} />;
    default:
      return null;
  }
}
