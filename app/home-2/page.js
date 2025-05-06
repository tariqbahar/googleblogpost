import Layout from "@/components/Layout";
import SectionHeader from "@/components/essential/SectionHeader";
import Banner from "@/components/home-2/Banner";
import PostTwo from "@/components/posts/Post-2";
import PostBlack from "@/components/posts/PostBlack";
import homepageData from "@/data/pages/_index-2.json";
import allPosts from "@/data/posts.json";
import { popularCategories } from "@/functions/categories";
import { isPostInArray } from "@/libs/utils/isPostInArray";
import { slugify } from "@/libs/utils/slugify";
import styles from "@/styles/modules/Style.module.scss";
import Image from "next/image";
import Link from "next/link";

const Home = async () => {
  // homepage data
  const { banner, popularTopics, latestArticles, popularArticles } =
    homepageData.frontmatter || {};

  // All Categories with image
  const categories = popularCategories(allPosts).slice(0, 6) || [];

  // Latest posts
  const latestPosts = allPosts.slice(0, 6) || [];
  const generatePattern = (length) => {
    const pattern = [];
    for (let i = 0; i < length; i++) {
      const section = Math.floor(i / 4);
      const position = i % 4;
      if (position === 0 || position === 1) {
        pattern.push(section * 4 + position * 3);
      }
    }
    return pattern;
  };
  const latestPostsPattern = generatePattern(latestPosts.length);

  // Trending posts
  const trendingPosts =
    allPosts.filter((post) => post.frontmatter.trending).slice(0, 4) || [];

  // Popular posts
  const popularPosts =
    allPosts
      .filter(
        (post) =>
          !isPostInArray(post, trendingPosts) &&
          post.frontmatter.trending &&
          post.frontmatter.featured
      )
      .slice(0, 4) || [];

  return (
    <Layout>
      <Banner trendingPosts={trendingPosts} banner={banner} />

      {popularTopics?.enable && (
        <section className="py-20 sm:py-28 bg-white">
          <SectionHeader
            title={popularTopics.title}
            buttonLabel={popularTopics.button.label}
            buttonLink={popularTopics.button.link}
            dark={false}
          />

          <div className="container mt-16">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center font-primary">
              {categories.map((category, key) => (
                <li key={key} className="relative group">
                  <Link
                    href={`/category/${slugify(category.name)}`}
                    className="relative block p-6 rounded-2xl border border-[#e0dfc8] bg-white transition-all duration-300 hover:border-secondary hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-semibold text-[#9A977A] group-hover:text-secondary capitalize transition-all duration-300">
                      {category.name}
                      <svg
                        className="w-5 h-5 md:w-7 md:h-7 text-current transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 26.0001L26 2.00012M26 2.00012H4.4M26 2.00012V23.6001"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Link>

                  {/* Hover Preview Image */}
                  <div
                    className={`absolute z-50 hidden group-hover:block transition-all duration-300 transform scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 pointer-events-none ${key % 2 === 0 ? 'left-1/2 -translate-x-1/2' : 'right-1/2 translate-x-1/2'
                      } top-full mt-4`}
                  >
                    <div className="w-64 h-36 overflow-hidden rounded-xl shadow-2xl border border-white backdrop-blur-lg bg-white/30">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={256}
                        height={144}
                        className="object-cover w-full h-full scale-110 group-hover:scale-100 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}


      {/* Latest Articles */}
      {latestArticles?.enable && (
        <section className={`py-16 sm:py-24 ${styles.darkBg}`}>
          <SectionHeader
            title={latestArticles.title}
            buttonLabel={latestArticles.button.label}
            buttonLink={latestArticles.button.link}
            dark={true}
          />

          <div className="container sm:mt-6 md:mt-8 overflow-clip">
            <div className="row g-6 justify-center mt-0">
              {latestPosts.map((post, index) => (
                <div
                  key={index}
                  className={`${latestPostsPattern.includes(index) ? "lg:col-5" : "lg:col-7"
                    }`}
                >
                  <PostBlack post={post} color="black" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Latest Articles */}

      {/* Popular Articles */}
      {popularArticles?.enable && (
        <section className="py-16 sm:py-24">
          <SectionHeader
            title={popularArticles.title}
            buttonLabel={popularArticles.button.label}
            buttonLink={popularArticles.button.link}
            dark={false}
          />

          <div className="container sm:mt-6 md:mt-8 overflow-clip">
            <div className="row gx-5 gy-6 mt-0">
              {popularPosts.map((post, index) => (
                <div className="xl:col-3 lg:col-4 sm:col-6" key={index}>
                  <PostTwo post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Popular Articles */}
    </Layout>
  );
};

export default Home;
