import LegalPageLayout from "./LegalPageLayout";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
        odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
        quis sem at nibh elementum imperdiet.
      </p>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          1. Information We Collect
        </h2>
        <p>
          Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue
          semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class
          aptent taciti sociosqu ad litora torquent per conubia nostra, per
          inceptos himenaeos.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          2. How We Use Your Information
        </h2>
        <p>
          Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.
          Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem
          at dolor. Maecenas mattis. Sed convallis tristique sem.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          3. Data Retention and Security
        </h2>
        <p>
          Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus,
          iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis
          ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper
          vel, tincidunt sed, euismod in, nibh.
        </p>
      </section>
      <p className="text-xs">
        Last updated: placeholder. This is placeholder content and will be
        replaced with the official Privacy Policy.
      </p>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
