# SEO Guide for School Transparency

A beginner-friendly guide to getting your site found on Google.

---

## Table of Contents
1. [What You've Already Done](#what-youve-already-done)
2. [Immediate Action Items](#immediate-action-items)
3. [On-Page SEO Checklist](#on-page-seo-checklist)
4. [Technical SEO Checklist](#technical-seo-checklist)
5. [Content Strategy](#content-strategy)
6. [Building Authority (Backlinks)](#building-authority-backlinks)
7. [Ongoing Monthly Tasks](#ongoing-monthly-tasks)
8. [Tools You Should Use](#tools-you-should-use)
9. [Common Mistakes to Avoid](#common-mistakes-to-avoid)

---

## What You've Already Done ✅

- [x] Verified site ownership with Google Search Console
- [x] Created sitemap.xml (auto-generates all your pages)
- [x] Created robots.txt (tells Google where to find sitemap)
- [x] Submitted sitemap to Google Search Console

---

## Immediate Action Items

### 1. Request Indexing for Top Pages
Go to [Google Search Console](https://search.google.com/search-console) and use the URL Inspection tool:

1. Paste each URL in the search bar at the top
2. Click "Request Indexing"
3. Do this for your 10 most important pages:
   - https://schooltransparency.com
   - https://schooltransparency.com/blog
   - https://schooltransparency.com/cities
   - Your top 7 blog posts

**Limit:** Google allows ~10-20 requests per day.

### 2. Set Up Google Analytics
Track who visits your site:

1. Go to [Google Analytics](https://analytics.google.com)
2. Create an account and property for schooltransparency.com
3. Get your Measurement ID (looks like G-XXXXXXXXXX)
4. Add it to your Next.js project (ask Claude to help with this)

### 3. Verify Your Site Works on Mobile
1. Go to [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
2. Enter: https://schooltransparency.com
3. Fix any issues it finds

---

## On-Page SEO Checklist

These are things to do for EVERY page/blog post:

### Title Tags (Most Important!)
- Keep under 60 characters
- Include your main keyword near the beginning
- Make it compelling (people need to want to click)

**Good:** "Teaching Salaries in Dubai 2026 | School Transparency"
**Bad:** "School Transparency - Blog Post About Salaries"

### Meta Descriptions
- Keep between 150-160 characters
- Include your main keyword naturally
- Add a call to action

**Good:** "Compare international teacher salaries in Dubai. See real pay data, housing allowances, and benefits from verified teachers. Updated for 2026."

### Headings Structure
Every page should have:
- ONE H1 tag (your main title)
- Multiple H2 tags (main sections)
- H3 tags for subsections

```
H1: Teaching in Dubai - Complete Salary Guide
  H2: Average Teacher Salaries
    H3: Primary School Teachers
    H3: Secondary School Teachers
  H2: Benefits and Allowances
  H2: Cost of Living Comparison
```

### Images
For every image:
- Add descriptive `alt` text (helps blind users AND Google)
- Use descriptive filenames: `dubai-teacher-salary-chart.jpg` not `IMG_1234.jpg`
- Compress images for fast loading (use [TinyPNG](https://tinypng.com))

### Internal Linking
Link your pages together:
- Blog posts should link to related blog posts
- City pages should link to relevant blog posts
- Use descriptive anchor text

**Good:** "Learn more about [teaching salaries in Abu Dhabi](/cities/abu-dhabi)"
**Bad:** "Click [here](/cities/abu-dhabi) for more info"

### URL Structure
Keep URLs clean and descriptive:
- **Good:** `/blog/dubai-teacher-salary-guide`
- **Bad:** `/blog/post-123` or `/blog/a-complete-guide-to-everything-you-need-to-know-about-salaries`

---

## Technical SEO Checklist

### Page Speed (Critical!)
Google ranks faster sites higher.

1. Test at [PageSpeed Insights](https://pagespeed.web.dev)
2. Aim for scores above 80
3. Common fixes:
   - Optimize images (WebP format, proper sizing)
   - Remove unused JavaScript
   - Enable caching (Vercel does this automatically)

### Core Web Vitals
Google's key performance metrics:
- **LCP** (Largest Contentful Paint): Main content loads in < 2.5 seconds
- **FID** (First Input Delay): Page responds to clicks in < 100ms
- **CLS** (Cumulative Layout Shift): Page doesn't jump around while loading

Check in: Search Console → Experience → Core Web Vitals

### HTTPS
Your site should use HTTPS (the padlock icon). Vercel handles this automatically. ✅

### Mobile Responsiveness
- Test on real phones, not just browser resize
- Text should be readable without zooming
- Buttons should be easy to tap

### Broken Links
Regularly check for 404 errors:
- Search Console → Indexing → Pages → Look for "Not found (404)"
- Fix or redirect broken links

---

## Content Strategy

### Keyword Research (Finding What People Search For)

1. **Use Free Tools:**
   - [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/) (free with Google Ads account)
   - [Ubersuggest](https://neilpatel.com/ubersuggest/) (limited free searches)
   - [AnswerThePublic](https://answerthepublic.com) (questions people ask)

2. **Think Like Your Audience:**
   - What questions do international teachers have?
   - What are they searching before moving abroad?
   - Examples:
     - "international school teacher salary dubai"
     - "is teaching in abu dhabi worth it"
     - "best countries for teaching abroad 2026"

3. **Check Competition:**
   - Search your target keyword on Google
   - Can you create better content than the top 5 results?
   - Look for gaps they don't cover

### Content That Ranks

**Write for humans first, Google second.**

1. **Answer the search intent:**
   - If someone searches "Dubai teacher salary", they want numbers
   - Give them salary ranges, not just general advice

2. **Be comprehensive:**
   - Cover the topic thoroughly
   - Aim for 1,500+ words on important topics
   - Include data, examples, and specifics

3. **Update regularly:**
   - Google prefers fresh content
   - Update salary data, dates, and statistics yearly
   - Add "Updated for 2026" to titles

4. **Use your unique data:**
   - You have real city data and school information
   - This is valuable content competitors don't have
   - Feature it prominently

---

## Building Authority (Backlinks)

Backlinks are links from other websites to yours. They're like "votes" telling Google your site is trustworthy.

### How to Get Backlinks

1. **Create Shareable Content:**
   - Salary comparison charts
   - "Best cities for teachers" lists
   - Original research or surveys

2. **Guest Posting:**
   - Write articles for teaching blogs
   - Include a link back to your site
   - Look for sites like International Schools Review forums

3. **Social Media:**
   - Share blog posts on teacher Facebook groups
   - Reddit communities (r/internationalteachers, r/teachingabroad)
   - LinkedIn articles

4. **Teacher Communities:**
   - Participate in forums and discussions
   - Be helpful, not spammy
   - Link to your content when genuinely relevant

5. **Reach Out:**
   - Find bloggers who write about teaching abroad
   - Offer to provide data or quotes for their articles
   - Suggest resource swaps

### What NOT to Do
- Don't buy backlinks (Google penalizes this)
- Don't spam comments with links
- Don't use "link farms" or exchange schemes

---

## Ongoing Monthly Tasks

### Weekly (10 minutes)
- [ ] Check Search Console for errors
- [ ] Look at which pages are getting impressions
- [ ] Note any crawl issues

### Monthly (1 hour)
- [ ] Review top performing pages in Analytics
- [ ] Check Core Web Vitals scores
- [ ] Fix any 404 errors
- [ ] Update one old blog post with fresh info
- [ ] Write 2-4 new blog posts targeting keywords

### Quarterly (2 hours)
- [ ] Review keyword rankings (use free tier of Ubersuggest)
- [ ] Analyze competitor sites for content ideas
- [ ] Update sitemap if site structure changed
- [ ] Review and refresh meta descriptions for top pages

---

## Tools You Should Use

### Free & Essential
| Tool | Purpose | Link |
|------|---------|------|
| Google Search Console | See how Google views your site | [Link](https://search.google.com/search-console) |
| Google Analytics | Track visitors and behavior | [Link](https://analytics.google.com) |
| PageSpeed Insights | Check site speed | [Link](https://pagespeed.web.dev) |
| Mobile-Friendly Test | Verify mobile experience | [Link](https://search.google.com/test/mobile-friendly) |

### Free with Limits
| Tool | Purpose | Link |
|------|---------|------|
| Ubersuggest | Keyword research | [Link](https://neilpatel.com/ubersuggest/) |
| AnswerThePublic | Find questions people ask | [Link](https://answerthepublic.com) |
| Screaming Frog | Site audit (500 pages free) | [Link](https://www.screamingfrog.co.uk) |

### Worth Paying For (Later)
| Tool | Purpose | Cost |
|------|---------|------|
| Ahrefs | Complete SEO toolkit | $99/mo |
| SEMrush | Keyword & competitor research | $120/mo |
| Surfer SEO | Content optimization | $59/mo |

Start with free tools. Paid tools are only worth it once you have traffic to optimize.

---

## Common Mistakes to Avoid

### 1. Keyword Stuffing
**Bad:** "Dubai teacher salary is the best Dubai teacher salary for Dubai teachers looking for Dubai teaching salary information."

**Good:** Write naturally. Use synonyms and related terms.

### 2. Duplicate Content
Don't copy-paste the same content across multiple pages. Each page should be unique.

### 3. Ignoring Search Intent
If someone searches "how to get a teaching job in Dubai", they want a step-by-step process, not a sales pitch.

### 4. Neglecting Mobile
Over 60% of searches are on mobile. If your site is hard to use on a phone, you'll lose rankings.

### 5. Expecting Instant Results
SEO takes 3-6 months to show significant results. Be patient and consistent.

### 6. Only Focusing on Rankings
Rankings don't matter if people don't click. Write compelling titles and descriptions.

### 7. Forgetting About User Experience
If visitors leave immediately (high bounce rate), Google notices. Make your content valuable and easy to read.

---

## Quick Wins for School Transparency

Based on your site, here are specific recommendations:

### 1. Add Schema Markup (Structured Data)
Help Google understand your content better. Add:
- Article schema for blog posts
- FAQ schema for common questions
- Organization schema for your site

*(Ask Claude to implement these)*

### 2. Create Location-Based Content
You have city data - use it for SEO:
- "Teaching in [City] - Complete Guide 2026"
- "Best International Schools in [City]"
- "[City] vs [City] for Teachers"

### 3. Build Topic Clusters
Group related content:
- **Hub page:** "Teaching in the UAE"
- **Spoke pages:** Dubai guide, Abu Dhabi guide, visa info, salary comparison

### 4. Add an FAQ Section
Each city page could have FAQs:
- "What is the average teacher salary in Dubai?"
- "Do teachers get housing allowance in Abu Dhabi?"

This content can appear in Google's "People Also Ask" boxes.

### 5. Leverage Your Unique Data
Your real school and salary data is valuable. Create:
- Salary comparison tools
- School ratings/reviews
- Cost of living calculators

---

## Timeline: What to Expect

| Timeframe | What Happens |
|-----------|--------------|
| Week 1 | Google discovers your sitemap (done!) |
| Weeks 2-4 | Pages start getting indexed |
| Months 1-3 | You appear for low-competition keywords |
| Months 3-6 | Rankings improve as Google trusts your site |
| Months 6+ | Significant organic traffic if content is good |

**Remember:** SEO is a marathon, not a sprint. Consistency beats intensity.

---

## Next Steps

1. ⬜ Set up Google Analytics
2. ⬜ Request indexing for top 10 pages
3. ⬜ Run PageSpeed test and fix issues
4. ⬜ Add meta descriptions to all pages (if missing)
5. ⬜ Create 5 new blog posts targeting specific keywords
6. ⬜ Add FAQ sections to city pages
7. ⬜ Share content in teacher communities

---

*Last updated: January 2026*
