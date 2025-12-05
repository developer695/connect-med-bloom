import UnifiMedProposal from "@/components/proposal/UnifiMedProposal";
import { ProposalContentProvider } from "@/contexts/ProposalContentContext";

const Index = () => {
  return (
    <ProposalContentProvider>
      <UnifiMedProposal />
    </ProposalContentProvider>
  );
};

export default Index;
