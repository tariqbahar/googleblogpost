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
  const categories = popularCategories(allPosts).slice(0, 8) || [];

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

        {/* Popular Topics */}
{popularTopics?.enable && (
  <section className="py-16 sm:py-24">
    <SectionHeader
      title={popularTopics.title}
      buttonLabel={popularTopics.button.label}
      buttonLink={popularTopics.button.link}
      dark={false}
    />
<div className="container mt-12">
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {categories.map((category, key) => (
      <div key={key} className="relative group flex flex-col items-center">
        
        {/* Compact Button Box */}
        <Link
          href={`/category/${slugify(category.name)}`}
          className="relative z-10 w-full text-center px-4 py-4 border border-[#9A977A] rounded-lg bg-white transition-all duration-300 hover:bg-[#9A977A] hover:text-white shadow-sm"
        >
          <span className="inline-flex items-center justify-center text-base md:text-lg font-medium text-[#2B3D2F] group-hover:text-white transition-colors">
            {category.name}
            <svg className="ml-2 h-4 w-4 group-hover:text-white transition-colors" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 26.0001L26 2.00012M26 2.00012H4.4M26 2.00012V23.6001" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </Link>

        {/* Hover Image BELOW the box but visually above */}
        <div
          className="absolute top-full mt-3 w-[192px] h-[120px] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out shadow-md rounded overflow-hidden"
        >
          <img
            src={category.image || '/placeholder.jpg'}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    ))}
  </div>
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
                  className={`${
                    latestPostsPattern.includes(index) ? "lg:col-5" : "lg:col-7"
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
