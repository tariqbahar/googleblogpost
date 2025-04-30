import Post from "@/components/posts/Post";
import styles from "@/styles/modules/Style.module.scss";
import Link from "next/link";

const Banner = ({ trendingPosts, banner }) => {
  return (
    <>
      <section
        className={`py-20 sm:py-28 relative z-10 after:absolute after:h-3/4 after:w-full after:content-[''] after:left-0 after:bottom-0 after:bg-gradient-to-t after:from-light after:-z-10 after:pointer-events-none before:absolute before:h-1/4 before:w-full before:content-[''] before:left-0 before:top-0 before:bg-gradient-to-b before:from-light before:-z-10 before:pointer-events-none ${styles.dotBg}`}
      >
        <div className="container">
          <div className="row justify-center items-center">
            <div className="xl:col-8 lg:col-10">
              <h1 className="lg:text-6xl md:text-5xl text-[40px] text-black !leading-snug text-center text-balance -mt-2">
                <span>{banner.heading}</span>
              </h1>

              
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24 overflow-clip relative z-50">
        {/* prettier-ignore */}
        <div className="absolute w-[1920px] h-[728px] left-1/2 -translate-x-1/2 bottom-0 pointer-events-none">
          <svg className="text-secondary w-full absolute bottom-0 pointer-events-none -z-10" width="1920" height="728" viewBox="0 0 1920 728" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0C953.5 380.5 1009 380.5 1920 0V803.5H0V0Z" fill="currentColor"/></svg>
          
          {/* fix svg background for large devices */}
          <div className="absolute w-full h-full z-10 after:content-[''] after:bg-secondary after:absolute after:h-full after:w-full after:left-full after:bottom-0 after:-z-10 before:content-[''] before:bg-secondary before:absolute before:h-full before:w-full before:-left-full before:bottom-0 before:-z-10"></div>
        </div>

        {/* start of posts */}
        <div className="container">
          <div className="row xl:row-cols-4 lg:row-cols-3 sm:row-cols-2 row-cols-1 g-6">
            {trendingPosts.map((post, index) => (
              <div
                className="col xl:last:block last:hidden [&:nth-child(3)]:hidden lg:[&:nth-child(3)]:block [&:nth-child(2)]:hidden sm:[&:nth-child(2)]:block"
                key={index}
              >
                <Post post={post} />
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="flex xl:hidden justify-center mt-10 sm:mt-12 relative z-50">
            <Link
              className="button button-light button-lg group animate-top-right"
              href="/blog"
            >
              <span className="relative overflow-hidden transition-none [&>span]:block">
                <span className="group-hover:-translate-y-[200%] group-hover:scale-y-[2] group-hover:rotate-12">
                  All Posts
                </span>
                <span className="absolute left-0 top-0 scale-y-[2] rotate-12 translate-y-[200%] group-hover:translate-y-0 group-hover:scale-y-100 group-hover:rotate-0">
                  All Posts
                </span>
              </span>
              <span className="overflow-hidden leading-none -translate-y-[2px]">
                {/* prettier-ignore */}
                <svg className="inline-block animate-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9.00005L9 1.00005M9 1.00005H1.8M9 1.00005V8.20005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </Link>
          </div>
        </div>
        {/* end of posts */}
      </section>
    </>
  );
};

export default Banner;
