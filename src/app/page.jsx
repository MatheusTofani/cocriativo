import FormLogin from "./components/login/formLogin";

export default function Home() {
  return (
    <main className="bg-[url(/background.jpg)] h-screen w-full bg-cover bg-center flex items-center justify-center p-[40px]">
       <div className="bg-[#f9f5f3] rounded-xl h-auto w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] mx-auto py-10 px-6 md:px-12 flex flex-col items-center">
            <img src="/cocriativo.png" className="h-[90px] mb-[40px]" />
          <FormLogin />
        </div>
    </main>
  );
}
