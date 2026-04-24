import EnableMfa from "@/components/account/EnableMfa";
import Sessions from "@/components/account/Sessions";

const Home = () => {
  return (
    <div className="max-w-fit mx-auto">
      <div className="flex max-w-3xl flex-col gap-2 mx-auto w-full md:max-w-5xl px-6 py-8">
        <h1 className="text-[28px] leading-[34px] tracking-[-0.416px] text-[#000509e3] dark:text-inherit font-extrabold">
          Setup security and sessions
        </h1>
        <p className="text-sm text-[#0007149f] dark:text-gray-100 font-normal">
          Follow the steps to activate using the Squeezy.
        </p>
      </div>
      <div className="relative max-w-3xl py-0 mx-auto px-6 pl-0 md:max-w-5xl">
        <div className="steps-gradient dark:bg-gray-800 absolute top-0 h-[700px] w-px"></div>
        <div className="flex flex-col gap-5">
          <div className="relative  transition duration-200 ease-in-out">
            <div className="bg-white dark:bg-background  absolute -left-[9.5px] top-7 z-10 block h-5 w-5 rounded-full"></div>
            <div>
              <EnableMfa />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="relative transition duration-200 ease-in-out">
            <div className="bg-white dark:bg-background  absolute -left-[9.5px] top-7 z-10 block h-5 w-5 rounded-full"></div>
            <div>
              <Sessions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
