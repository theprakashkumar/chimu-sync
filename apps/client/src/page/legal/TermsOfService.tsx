import LegalPageLayout from "./LegalPageLayout";

const TermsOfService = () => {
  return (
    <LegalPageLayout title="Terms of Service">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          1. Acceptance of Terms
        </h2>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          2. Use of the Service
        </h2>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          3. Limitation of Liability
        </h2>
        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
          sit amet.
        </p>
      </section>
      <p className="text-xs">
        Last updated: placeholder. This is placeholder content and will be
        replaced with the official Terms of Service.
      </p>
    </LegalPageLayout>
  );
};

export default TermsOfService;
