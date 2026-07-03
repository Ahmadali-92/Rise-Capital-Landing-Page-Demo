import EquipmentDetail from '@/shared/components/equipment/EquipmentDetail';
import {rcFontVars} from '@/shared/premium-fonts';

// Public equipment detail page — premium industrial-editorial redesign.
// (No cursor-follower dot here — it lives only on the landing page.)
export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  return (
    <div className={rcFontVars}>
      <EquipmentDetail id={id} />
    </div>
  );
}
