import Infographic from './Infographic';
import { decisionData } from '@/lib/infographics';

export default function DecisionGraph() {
  return <Infographic data={decisionData} />;
}
