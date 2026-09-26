<script setup lang="ts">
import { computed, ref } from "vue";

const menuOpen = ref(false);
const searchOpen = ref(false);
const activeClass = ref("Fitness");

const classes = [
  {
    name: "Fitness",
    image: "/media/class-fitness.jpg",
    text: "Build strength, mobility, and stamina with guided fitness sessions designed for every level.",
  },
  {
    name: "Body Building",
    image: "/media/class-bodybuilding.jpg",
    text: "Structured hypertrophy training with progressive overload and expert coaching cues.",
  },
  {
    name: "Yoga",
    image: "/media/class-yoga.jpg",
    text: "Improve flexibility, balance, and recovery with focused yoga flows for athletes.",
  },
  {
    name: "Cardio",
    image: "/media/class-cardio.jpg",
    text: "High-energy cardio classes that torch calories and boost endurance.",
  },
  {
    name: "Weight Lifting",
    image: "/media/class-bodybuilding.jpg",
    text: "Technique-first lifting for power, form, and long-term joint health.",
  },
  {
    name: "Aerobics",
    image: "/media/class-fitness.jpg",
    text: "Group aerobics that keep your heart rate up and your motivation higher.",
  },
] as const;

const activeClassData = computed(
  () => classes.find((c) => c.name === activeClass.value) ?? classes[0],
);

const schedule = [
  { day: "Monday", slots: ["Cardio 06:00–07:00", "Crossfit 08:00–09:00", "Yoga 17:00–18:00", "Body Building 19:00–20:00"] },
  { day: "Tuesday", slots: ["Fitness 06:00–07:00", "Aerobics 09:00–10:00", "Weight Lifting 17:00–18:00", "Cardio 19:00–20:00"] },
  { day: "Wednesday", slots: ["Yoga 06:00–07:00", "Body Building 08:00–09:00", "Crossfit 17:00–18:00", "Fitness 19:00–20:00"] },
  { day: "Thursday", slots: ["Cardio 06:00–07:00", "Weight Lifting 09:00–10:00", "Aerobics 17:00–18:00", "Yoga 19:00–20:00"] },
  { day: "Friday", slots: ["Crossfit 06:00–07:00", "Fitness 08:00–09:00", "Body Building 17:00–18:00", "Cardio 19:00–20:00"] },
  { day: "Saturday", slots: ["Yoga 08:00–09:00", "Aerobics 10:00–11:00", "Fitness 12:00–13:00", "Open Gym 16:00–20:00"] },
];

const trainers = [
  { name: "Alex Rivera", role: "Strength Coach", image: "/media/trainer-1.jpg" },
  { name: "Sam Carter", role: "HIIT Specialist", image: "/media/trainer-2.jpg" },
  { name: "Jordan Lee", role: "Yoga Instructor", image: "/media/trainer-3.jpg" },
  { name: "Chris Morgan", role: "Bodybuilding Coach", image: "/media/trainer-4.jpg" },
];

const plans = [
  {
    name: "Basic",
    price: "150",
    features: ["Access to gym floor", "Locker room", "1 group class / week", "Fitness assessment"],
  },
  {
    name: "Standard",
    price: "200",
    features: ["Everything in Basic", "Unlimited group classes", "Sauna access", "Monthly coach check-in"],
  },
  {
    name: "Premium",
    price: "250",
    features: ["Everything in Standard", "Personal training sessions", "Nutrition plan", "Priority booking"],
  },
];

const posts = [
  {
    title: "Achieving Peak Body Fitness with Purpose",
    date: "12 Sep",
    image: "/media/blog-1.jpg",
  },
  {
    title: "How Progressive Overload Builds Real Strength",
    date: "05 Sep",
    image: "/media/blog-2.jpg",
  },
  {
    title: "Recovery Habits That Keep You Training Longer",
    date: "28 Aug",
    image: "/media/blog-3.jpg",
  },
];
</script>

<template>
  <div class="page">
    <a class="skip-link" href="#main">Skip to content</a>
    <!-- Top bar -->
    <div class="topbar">
      <div class="container topbar__inner">
        <div class="topbar__left">
          <span>+1 (555) 010-2090</span>
          <span>hello@gympulse.local</span>
          <span>120 Fitness Ave, Downtown</span>
        </div>
        <div class="topbar__right">
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Twitter">x</a>
          <a href="#" aria-label="LinkedIn">in</a>
          <a href="#" aria-label="Instagram">ig</a>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <header class="nav">
      <div class="container nav__inner">
        <a href="#home" class="nav__brand">
          <img src="/logo.png" alt="GymPulse" />
          <span>GymPulse</span>
        </a>
        <nav id="site-menu" class="nav__links" :class="{ open: menuOpen }">
          <a href="#home" @click="menuOpen = false">Home</a>
          <a href="#about" @click="menuOpen = false">About</a>
          <a href="#services" @click="menuOpen = false">Services</a>
          <a href="#classes" @click="menuOpen = false">Classes</a>
          <a href="#schedule" @click="menuOpen = false">Schedule</a>
          <a href="#pricing" @click="menuOpen = false">Pricing</a>
          <a href="#blog" @click="menuOpen = false">Blog</a>
          <a href="#contact" @click="menuOpen = false">Contact</a>
          <a href="#pricing" class="nav__cta" @click="menuOpen = false">Start Free Trial</a>
        </nav>
        <div class="nav__actions">
          <button type="button" class="icon-btn icon-btn--desktop" aria-label="Search" @click="searchOpen = !searchOpen">⌕</button>
          <button
            type="button"
            class="icon-btn menu-btn"
            :aria-expanded="menuOpen"
            aria-controls="site-menu"
            aria-label="Menu"
            @click="menuOpen = !menuOpen"
          >
            {{ menuOpen ? "✕" : "☰" }}
          </button>
        </div>
      </div>
      <div v-if="searchOpen" class="search-bar container">
        <input type="search" placeholder="Search classes, trainers…" />
      </div>
    </header>

    <main id="main">
    <!-- Hero -->
    <section id="home" class="hero" aria-label="Hero">
      <video
        class="hero__bg"
        src="/hero.mp4"
        autoplay
        muted
        loop
        playsinline
        aria-hidden="true"
      />
      <div class="hero__dim" />
      <div class="hero__slash hero__slash--a" aria-hidden="true" />
      <div class="hero__slash hero__slash--b" aria-hidden="true" />
      <div class="hero__slash hero__slash--c" aria-hidden="true" />

      <div class="container hero__content">
        <div class="hero__copy">
          <p class="hero__eyebrow">
            <i></i>
            <span>Keep Your Body Fitness With Workouts</span>
          </p>
          <h1>
            Your Fitness<br />
            Your Victory
          </h1>
          <p class="hero__text">
            Gym workouts are designed to help you build strength, endurance, and confidence. Join classes led by coaches who keep every session focused and effective.
          </p>
          <div class="hero__cta">
            <a href="#schedule" class="btn-red">View Class Schedule</a>
            <div class="hero__proof">
              <div class="hero__avatars" aria-hidden="true">
                <img src="/media/avatar-1.jpg" alt="" />
                <img src="/media/avatar-2.jpg" alt="" />
                <img src="/media/avatar-3.jpg" alt="" />
              </div>
              <span>2k+ Satisfied Customer</span>
            </div>
          </div>
        </div>
        <div class="hero__media">
          <img src="/image1.png" alt="" />
        </div>
      </div>

      <div class="hero__cut" aria-hidden="true" />
    </section>

    <!-- About under hero with image2 -->
    <section id="about" class="about">
      <div class="container about__grid">
        <div class="about__side">
          <img src="/media/about-side.jpg" alt="" />
        </div>
        <div class="about__copy">
          <p class="section-label">About Us</p>
          <h2 class="section-title about__title">We Have Lot Of Experience <span>Gym Training</span></h2>
          <p class="about__text">
            GymPulse is built for members who want more than a membership card. From first check-in to championship form, our coaches and floor are ready.
          </p>
          <ul class="check-list">
            <li>Over 15 years of experience</li>
            <li>Certified trainers</li>
            <li>Exceptional work quality</li>
          </ul>
          <a href="#pricing" class="btn-red">Get Started</a>
        </div>
        <div class="about__media">
          <div class="about__slash" aria-hidden="true" />
          <div class="about__badge" aria-hidden="true">●</div>
          <img src="/image2.png" alt="" />
        </div>
      </div>
    </section>

    <!-- Work process -->
    <section id="services" class="process">
      <div class="container">
        <p class="section-label">Work Process</p>
        <h2 class="section-title">Easy Step To Achieve <span>Your Goals</span></h2>
        <div class="process__row">
          <article>
            <div class="process__circle"><img src="/media/process-1.jpg" alt="" /></div>
            <h3>01. Gym Movement</h3>
            <p>Learn movement patterns and build a foundation that lasts.</p>
          </article>
          <article>
            <div class="process__circle"><img src="/media/process-2.jpg" alt="" /></div>
            <h3>02. Fitness Practice</h3>
            <p>Train consistently with classes and coaching that fit your week.</p>
          </article>
          <article>
            <div class="process__circle"><img src="/media/process-3.jpg" alt="" /></div>
            <h3>03. Achievement</h3>
            <p>Track progress, hit milestones, and keep raising the bar.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Classes -->
    <section id="classes" class="classes">
      <div class="container">
        <div class="classes__head">
          <div>
            <p class="section-label">Our Gym Fitness Classes</p>
            <h2 class="section-title">Gym &amp; Fitness <span>Training Classes</span></h2>
          </div>
          <a href="#schedule" class="btn-red">View All Class</a>
        </div>
        <div class="classes__grid">
          <ul class="classes__tabs">
            <li v-for="c in classes" :key="c.name">
              <button type="button" :class="{ active: activeClass === c.name }" @click="activeClass = c.name">
                {{ c.name }}
              </button>
            </li>
          </ul>
          <div class="classes__panel">
            <img :src="activeClassData.image" :alt="activeClassData.name" />
            <div>
              <h3>{{ activeClassData.name }}</h3>
              <p>{{ activeClassData.text }}</p>
              <a href="#schedule" class="btn-red">Join Class</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Schedule -->
    <section id="schedule" class="schedule">
      <div class="container">
        <p class="section-label">Training Class Schedule</p>
        <h2 class="section-title">Weekly <span>Class Timetable</span></h2>
        <div class="schedule__grid">
          <div v-for="day in schedule" :key="day.day" class="schedule__day">
            <h3>{{ day.day }}</h3>
            <ul>
              <li v-for="slot in day.slots" :key="slot">{{ slot }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Trainers -->
    <section class="trainers">
      <div class="container">
        <p class="section-label">Meet Our Skilled Trainer</p>
        <h2 class="section-title">Expert Coaches Ready To <span>Guide You</span></h2>
        <div class="trainers__grid">
          <article v-for="t in trainers" :key="t.name">
            <div class="trainers__photo"><img :src="t.image" :alt="t.name" /></div>
            <h3>{{ t.name }}</h3>
            <p>{{ t.role }}</p>
            <div class="trainers__social">
              <a href="#">f</a>
              <a href="#">x</a>
              <a href="#">in</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="pricing">
      <div class="container">
        <p class="section-label">Pricing Plans</p>
        <h2 class="section-title">Find Your <span>Perfect Plan</span></h2>
        <div class="pricing__grid">
          <article v-for="plan in plans" :key="plan.name" class="pricing__card">
            <h3>{{ plan.name }}</h3>
            <p class="pricing__price"><sup>$</sup>{{ plan.price }}<span>/mo</span></p>
            <ul>
              <li v-for="f in plan.features" :key="f">✓ {{ f }}</li>
            </ul>
            <a href="#contact" class="btn-red">Purchase Now</a>
          </article>
        </div>
      </div>
    </section>

    <!-- Blog -->
    <section id="blog" class="blog">
      <div class="container">
        <p class="section-label">Our Latest News &amp; Articles</p>
        <h2 class="section-title">Stories From The <span>Gym Floor</span></h2>
        <div class="blog__grid">
          <article v-for="post in posts" :key="post.title">
            <div class="blog__image">
              <img :src="post.image" :alt="post.title" />
              <span>{{ post.date }}</span>
            </div>
            <h3>{{ post.title }}</h3>
            <a href="#blog" class="read-more">Read More →</a>
          </article>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="footer">
      <div class="footer__accent" aria-hidden="true" />

      <div class="container footer__top">
        <article>
          <h5>Open Daily</h5>
          <p>Floor access from early morning to late evening, with staffed peak hours.</p>
        </article>
        <article>
          <h5>Expert Coaches</h5>
          <p>Certified trainers for strength, cardio, yoga, and personal programming.</p>
        </article>
        <article>
          <h5>Member First</h5>
          <p>Fast check-in, clear plans, and support that keeps your gym running smooth.</p>
        </article>
        <article>
          <h5>Flexible Plans</h5>
          <p>Basic to Premium memberships so every athlete finds the right fit.</p>
        </article>
      </div>

      <div class="container footer__grid">
        <div class="footer__brand-col">
          <div class="footer__brand">
            <img src="/logo.png" alt="" />
            <strong>GymPulse</strong>
          </div>
          <p class="footer__lead">
            Self-hostable gym management with a floor-ready experience for members, trainers, and staff.
            Train hard. Check in fast. Run your gym your way. From the welcome desk to the freestyle floor,
            GymPulse keeps memberships, classes, and billing in one place.
          </p>
          <p class="footer__lead footer__lead--soft">
            Visit our downtown location for a free intro session, or talk to the front desk about personal training packages.
          </p>
          <div class="footer__social">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">x</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="YouTube">yt</a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Work Process</a></li>
            <li><a href="#classes">All Classes</a></li>
            <li><a href="#schedule">Class Schedule</a></li>
            <li><a href="#pricing">Membership Plans</a></li>
            <li><a href="#blog">News &amp; Articles</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4>Popular Classes</h4>
          <ul>
            <li><a href="#classes">Body Building</a></li>
            <li><a href="#classes">Cardio Training</a></li>
            <li><a href="#classes">Yoga Flow</a></li>
            <li><a href="#classes">Weight Lifting</a></li>
            <li><a href="#classes">Fitness</a></li>
            <li><a href="#classes">Aerobics</a></li>
            <li><a href="#classes">Crossfit</a></li>
            <li><a href="#classes">Muscle Gain</a></li>
          </ul>
        </div>

        <div>
          <h4>Membership</h4>
          <ul>
            <li><a href="#pricing">Basic Plan</a></li>
            <li><a href="#pricing">Standard Plan</a></li>
            <li><a href="#pricing">Premium Plan</a></li>
            <li><a href="#pricing">Family Packages</a></li>
            <li><a href="#pricing">Student Discount</a></li>
            <li><a href="#contact">Corporate Wellness</a></li>
            <li><a href="#contact">Gift Membership</a></li>
            <li><a href="#contact">Free Trial Day</a></li>
          </ul>
        </div>

        <div>
          <h4>Support</h4>
          <ul>
            <li><a href="#contact">Help Center</a></li>
            <li><a href="#contact">Member Login Help</a></li>
            <li><a href="#contact">Billing Questions</a></li>
            <li><a href="#contact">Locker Policy</a></li>
            <li><a href="#contact">Lost &amp; Found</a></li>
            <li><a href="#contact">Safety Guidelines</a></li>
            <li><a href="#contact">Careers</a></li>
            <li><a href="#contact">Partner With Us</a></li>
          </ul>
        </div>

        <div class="footer__news-col">
          <h4>Newsletter</h4>
          <p class="footer__news-copy">
            Get class drops, coach tips, event nights, and gym updates delivered weekly. No spam — just what keeps you moving.
          </p>
          <form class="footer__news" @submit.prevent>
            <input type="text" placeholder="Your name" />
            <input type="email" required placeholder="Your email address" />
            <button type="submit" class="btn-red">Subscribe Now</button>
          </form>
        </div>
      </div>

      <div class="container footer__mid">
        <div class="footer__hours">
          <h4>Working Hours</h4>
          <ul>
            <li><span>Monday – Friday</span><strong>06:00 – 22:00</strong></li>
            <li><span>Saturday</span><strong>07:00 – 21:00</strong></li>
            <li><span>Sunday</span><strong>08:00 – 18:00</strong></li>
            <li><span>Public Holidays</span><strong>08:00 – 14:00</strong></li>
          </ul>
          <p class="footer__note">Last check-in 45 minutes before close. Kids zone hours may differ.</p>
        </div>

        <div class="footer__contact-block">
          <h4>Contact Desk</h4>
          <ul class="footer__contact">
            <li>
              <span>Front Desk</span>
              <strong>+1 (555) 010-2090</strong>
            </li>
            <li>
              <span>Membership Sales</span>
              <strong>+1 (555) 010-2091</strong>
            </li>
            <li>
              <span>Email</span>
              <strong>hello@gympulse.local</strong>
            </li>
            <li>
              <span>Coaching</span>
              <strong>coaches@gympulse.local</strong>
            </li>
            <li>
              <span>Address</span>
              <strong>120 Fitness Ave, Downtown<br />Suite 2B, City Center</strong>
            </li>
          </ul>
        </div>

        <div class="footer__gallery-block">
          <h4>Gym Gallery</h4>
          <div class="footer__gallery" aria-label="Gym gallery">
            <img src="/media/process-1.jpg" alt="" />
            <img src="/media/class-fitness.jpg" alt="" />
            <img src="/media/process-2.jpg" alt="" />
            <img src="/media/class-cardio.jpg" alt="" />
            <img src="/media/process-3.jpg" alt="" />
            <img src="/media/class-yoga.jpg" alt="" />
            <img src="/media/class-bodybuilding.jpg" alt="" />
            <img src="/media/blog-3.jpg" alt="" />
          </div>
        </div>

        <div class="footer__map-block">
          <h4>Find Us</h4>
          <div class="footer__map">
            <div class="footer__map-pin">GymPulse HQ</div>
            <p>120 Fitness Ave · Downtown</p>
            <a href="#contact" class="btn-red footer__map-btn">Get Directions</a>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <div class="container footer__bottom-inner">
          <p>© {{ new Date().getFullYear() }} GymPulse. All rights reserved. Built for gyms that own their stack.</p>
          <div class="footer__legal">
            <a href="#contact">Privacy Policy</a>
            <a href="#contact">Terms of Service</a>
            <a href="#contact">Cookie Settings</a>
            <a href="#contact">Accessibility</a>
            <a href="#contact">Support</a>
          </div>
        </div>
      </div>
    </footer>
    </main>

    <div class="mobile-cta" aria-hidden="false">
      <a href="tel:+15550102090" class="mobile-cta__call">Call</a>
      <a href="#pricing" class="btn-red mobile-cta__join">Start Free Trial</a>
    </div>
  </div>
</template>

<style scoped>
.muted {
  color: var(--muted);
  line-height: 1.7;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -3rem;
  z-index: 100;
  background: var(--red);
  color: #fff;
  padding: 0.65rem 1rem;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 1rem;
}

.topbar {
  background: #000;
  border-bottom: 1px solid #1f1f1f;
  font-size: 0.8rem;
  color: #ccc;
}

.topbar__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 0;
}

.topbar__left,
.topbar__right {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}

.topbar__right a {
  width: 1.5rem;
  height: 1.5rem;
  display: grid;
  place-items: center;
  border: 1px solid #333;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgb(11 11 11 / 0.96);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #1f1f1f;
}

.nav__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 74px;
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  flex-shrink: 0;
}

.nav__brand img {
  height: 42px;
  width: auto;
}

.nav__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem 1.1rem;
  margin-left: auto;
  margin-right: 0.35rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav__links a:hover {
  color: var(--red);
}

.nav__cta {
  display: none;
  background: var(--red);
  color: #fff !important;
  padding: 0.7rem 1rem;
  text-align: center;
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  margin-left: 0.25rem;
}

.icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border: 0;
  background: transparent;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
}

.menu-btn {
  display: none;
}

.search-bar {
  padding-bottom: 0.85rem;
}

.search-bar input {
  width: 100%;
  background: #151515;
  border: 1px solid #2a2a2a;
  color: white;
  padding: 0.75rem 1rem;
}

.mobile-cta {
  display: none;
}


.hero {
  position: relative;
  overflow: hidden;
  min-height: min(94vh, 860px);
  display: flex;
  align-items: flex-end;
  background: #050505;
  isolation: isolate;
}

.hero__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.55;
  transform: scale(1.02);
}

.hero__dim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgb(0 0 0 / 0.88) 0%, rgb(0 0 0 / 0.55) 42%, rgb(0 0 0 / 0.2) 72%, rgb(0 0 0 / 0.35) 100%),
    linear-gradient(180deg, rgb(0 0 0 / 0.25) 0%, transparent 35%, rgb(0 0 0 / 0.55) 100%);
}

.hero__slash {
  position: absolute;
  top: -20%;
  bottom: -20%;
  width: 28vw;
  min-width: 220px;
  background: linear-gradient(180deg, rgb(227 28 35 / 0.78), rgb(227 28 35 / 0.35));
  transform: skewX(-18deg);
  pointer-events: none;
  z-index: 1;
}

.hero__slash--a {
  left: 8%;
  opacity: 0.85;
}

.hero__slash--b {
  left: 22%;
  width: 14vw;
  opacity: 0.45;
  background: linear-gradient(180deg, rgb(227 28 35 / 0.55), rgb(227 28 35 / 0.15));
}

.hero__slash--c {
  right: 18%;
  width: 10vw;
  opacity: 0.28;
  background: linear-gradient(180deg, rgb(227 28 35 / 0.4), transparent);
}

.hero__content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 1.5rem;
  align-items: end;
  width: 100%;
  padding: 6rem 0 7.5rem;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1.1rem;
  color: #fff;
  font-family: var(--font-display);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.78rem;
  font-weight: 600;
}

.hero__eyebrow i {
  display: block;
  width: 36px;
  height: 3px;
  background: var(--red);
}

.hero__copy h1 {
  font-family: var(--font-display);
  font-size: clamp(3rem, 7.2vw, 5.4rem);
  line-height: 0.92;
  text-transform: uppercase;
  margin: 0 0 1.25rem;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.hero__text {
  max-width: 32rem;
  color: #cfcfcf;
  line-height: 1.75;
  margin: 0 0 1.75rem;
  font-size: 0.98rem;
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem 1.75rem;
}

.hero__proof {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-display);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  font-size: 0.9rem;
}

.hero__avatars {
  display: flex;
}

.hero__avatars img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #111;
  margin-left: -10px;
}

.hero__avatars img:first-child {
  margin-left: 0;
}

.hero__media {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.hero__media img {
  width: min(100%, 540px);
  filter: drop-shadow(0 28px 50px rgb(0 0 0 / 0.65));
}

.hero__cut {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 90px;
  z-index: 3;
  background: #fff;
  clip-path: polygon(0 100%, 0 55%, 50% 100%, 100% 55%, 100% 100%);
}

.about,
.process,
.classes,
.schedule,
.trainers,
.pricing,
.blog {
  padding: 5rem 0;
}

.about {
  background: #fff;
  color: #111;
  padding-top: 4rem;
}

.about__grid {
  display: grid;
  grid-template-columns: 0.7fr 1.1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.about__side img {
  width: 100%;
  height: 420px;
  object-fit: cover;
}

.about__title {
  color: #111;
}

.about__text {
  color: #555;
  line-height: 1.75;
}

.check-list {
  list-style: none;
  padding: 0;
  margin: 1.25rem 0 1.75rem;
}

.check-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.65rem;
  color: #333;
}

.check-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--red);
  font-weight: 700;
}

.about__media {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 420px;
}

.about__slash {
  position: absolute;
  width: 70%;
  height: 120%;
  background: var(--red);
  transform: skewX(-18deg);
  opacity: 0.95;
  z-index: 0;
}

.about__badge {
  position: absolute;
  left: 8%;
  top: 18%;
  z-index: 2;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #111;
  color: var(--red);
  display: grid;
  place-items: center;
  border: 3px solid var(--red);
  font-size: 1.2rem;
}

.about__media img {
  position: relative;
  z-index: 1;
  width: min(100%, 420px);
}

.process {
  background: var(--bg);
}

.process__row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2.5rem;
  text-align: center;
}

.process__circle {
  width: 180px;
  height: 180px;
  margin: 0 auto 1.25rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #2a2a2a;
  box-shadow: 0 0 0 6px rgb(227 28 35 / 0.25);
}

.process__circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.process h3 {
  font-family: var(--font-display);
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}

.process p {
  color: var(--muted);
  margin: 0;
  line-height: 1.6;
}

.classes {
  background: var(--bg-2);
}

.classes__head {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 2rem;
}

.classes__grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
}

.classes__tabs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.classes__tabs button {
  width: 100%;
  text-align: left;
  background: #101010;
  border: 1px solid #2a2a2a;
  color: white;
  padding: 0.95rem 1rem;
  font-family: var(--font-display);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}

.classes__tabs button.active,
.classes__tabs button:hover {
  background: var(--red);
  border-color: var(--red);
}

.classes__panel {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1.25rem;
  background: #101010;
  border: 1px solid #2a2a2a;
  overflow: hidden;
}

.classes__panel img {
  width: 100%;
  height: 100%;
  min-height: 320px;
  object-fit: cover;
}

.classes__panel > div {
  padding: 1.5rem 1.5rem 1.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.classes__panel h3 {
  font-family: var(--font-display);
  text-transform: uppercase;
  font-size: 1.6rem;
  margin: 0;
}

.classes__panel p {
  color: var(--muted);
  line-height: 1.7;
  margin: 0;
}

.schedule__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.schedule__day {
  background: #121212;
  border: 1px solid #2a2a2a;
  padding: 1.25rem;
}

.schedule__day h3 {
  margin: 0 0 0.85rem;
  font-family: var(--font-display);
  text-transform: uppercase;
  color: var(--red);
}

.schedule__day ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

.schedule__day li {
  background: #1a1a1a;
  padding: 0.65rem 0.75rem;
  font-size: 0.92rem;
  color: #ddd;
}

.trainers {
  background: var(--bg-2);
}

.trainers__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  text-align: center;
}

.trainers__photo {
  width: 170px;
  height: 170px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #2a2a2a;
}

.trainers__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trainers h3 {
  margin: 0;
  font-family: var(--font-display);
  text-transform: uppercase;
}

.trainers p {
  margin: 0.35rem 0 0.75rem;
  color: var(--muted);
}

.trainers__social {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.trainers__social a {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 1px solid #333;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.pricing__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 2rem;
}

.pricing__card {
  background: #121212;
  border: 1px solid #2a2a2a;
  padding: 2rem 1.5rem;
  text-align: center;
}

.pricing__card h3 {
  margin: 0;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.pricing__price {
  font-family: var(--font-display);
  font-size: 3rem;
  margin: 1rem 0 1.25rem;
  color: var(--red);
}

.pricing__price span {
  font-size: 1rem;
  color: #aaa;
}

.pricing__price sup {
  font-size: 1.2rem;
}

.pricing__card ul {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  display: grid;
  gap: 0.65rem;
  color: #d5d5d5;
  text-align: left;
}

.blog {
  background: var(--bg-2);
}

.blog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 2rem;
}

.blog__image {
  position: relative;
  margin-bottom: 1rem;
  overflow: hidden;
}

.blog__image img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.blog__image span {
  position: absolute;
  left: 0;
  bottom: 0;
  background: var(--red);
  padding: 0.45rem 0.7rem;
  font-family: var(--font-display);
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.blog h3 {
  font-family: var(--font-display);
  text-transform: uppercase;
  font-size: 1.15rem;
  line-height: 1.35;
  margin: 0 0 0.75rem;
}

.read-more {
  color: var(--red);
  font-family: var(--font-display);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.footer {
  position: relative;
  background:
    radial-gradient(ellipse at 15% 0%, rgb(227 28 35 / 0.14), transparent 42%),
    linear-gradient(180deg, #0d0d0d 0%, #050505 100%);
  padding-top: 3.5rem;
  border-top: 1px solid #1c1c1c;
}

.footer__accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--red) 30%, var(--red) 70%, transparent);
}

.footer__top {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
}

.footer__top article {
  background: #121212;
  border: 1px solid #242424;
  border-top: 2px solid var(--red);
  padding: 1.35rem 1.2rem 1.45rem;
}

.footer__top h5 {
  margin: 0 0 0.55rem;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.95rem;
}

.footer__top p {
  margin: 0;
  color: #b0b0b0;
  line-height: 1.65;
  font-size: 0.9rem;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.5fr 0.85fr 0.95fr 0.95fr 0.95fr 1.2fr;
  gap: 2.25rem 1.5rem;
  padding-bottom: 2.75rem;
  border-bottom: 1px solid #1f1f1f;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1rem;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 1.15rem;
}

.footer__brand img {
  height: 44px;
}

.footer__lead {
  color: #b8b8b8;
  line-height: 1.75;
  margin: 0 0 0.9rem;
  max-width: 30rem;
  font-size: 0.95rem;
}

.footer__lead--soft {
  color: #8f8f8f;
  font-size: 0.88rem;
}

.footer__social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1.35rem;
}

.footer__social a {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid #2c2c2c;
  background: #121212;
  color: #ddd;
  font-size: 0.72rem;
  text-transform: uppercase;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.footer__social a:hover {
  border-color: var(--red);
  background: var(--red);
  color: #fff;
}

.footer h4 {
  position: relative;
  font-family: var(--font-display);
  text-transform: uppercase;
  margin: 0 0 1.25rem;
  letter-spacing: 0.08em;
  font-size: 0.95rem;
  padding-bottom: 0.65rem;
}

.footer h4::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 28px;
  height: 2px;
  background: var(--red);
}

.footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
  color: #c8c8c8;
}

.footer ul a {
  color: #c8c8c8;
  transition: color 0.2s, padding-left 0.2s;
}

.footer ul a:hover {
  color: var(--red);
  padding-left: 4px;
}

.footer__mid {
  display: grid;
  grid-template-columns: 1fr 1.15fr 1.35fr 1fr;
  gap: 2rem 1.5rem;
  padding: 2.75rem 0 3.25rem;
}

.footer__hours ul {
  gap: 0.85rem;
}

.footer__hours li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px dashed #2a2a2a;
  padding-bottom: 0.55rem;
  color: #cfcfcf;
}

.footer__hours span {
  color: #8f8f8f;
}

.footer__hours strong {
  font-weight: 600;
  color: #fff;
}

.footer__note {
  margin: 1rem 0 0;
  color: #777;
  font-size: 0.82rem;
  line-height: 1.55;
}

.footer__contact li {
  display: grid;
  gap: 0.2rem;
}

.footer__contact span {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #777;
  font-family: var(--font-display);
}

.footer__contact strong {
  font-weight: 500;
  color: #e8e8e8;
  font-size: 0.92rem;
  line-height: 1.45;
}

.footer__news-copy {
  margin: 0 0 0.9rem;
  color: #b0b0b0;
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer__news {
  display: grid;
  gap: 0.65rem;
}

.footer__news input {
  background: #121212;
  border: 1px solid #2a2a2a;
  color: white;
  padding: 0.85rem 0.95rem;
  transition: border-color 0.2s;
}

.footer__news input:focus {
  outline: none;
  border-color: var(--red);
}

.footer__gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.45rem;
}

.footer__gallery img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  filter: grayscale(0.2);
  transition: filter 0.2s, transform 0.2s;
}

.footer__gallery img:hover {
  filter: none;
  transform: scale(1.03);
}

.footer__map {
  min-height: 220px;
  background:
    linear-gradient(160deg, rgb(227 28 35 / 0.18), transparent 45%),
    radial-gradient(circle at 30% 40%, #2a2a2a 0%, #111 55%, #0a0a0a 100%);
  border: 1px solid #2a2a2a;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.55rem;
}

.footer__map-pin {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--red);
  font-size: 0.95rem;
}

.footer__map p {
  margin: 0;
  color: #cfcfcf;
}

.footer__map-btn {
  width: fit-content;
  margin-top: 0.35rem;
  padding: 0.7rem 1.15rem;
  font-size: 0.8rem;
}

.footer__bottom {
  border-top: 1px solid #1f1f1f;
  padding: 1.35rem 0;
  background: rgb(0 0 0 / 0.45);
  color: #999;
  font-size: 0.85rem;
}

.footer__bottom-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem 1.5rem;
  justify-content: space-between;
  align-items: center;
}

.footer__bottom-inner p {
  margin: 0;
  max-width: 36rem;
  line-height: 1.5;
}

.footer__legal {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.1rem;
}

.footer__legal a {
  color: #aaa;
  transition: color 0.2s;
}

.footer__legal a:hover {
  color: var(--red);
}

@media (max-width: 1200px) {
  .nav__links {
    gap: 0.25rem 0.85rem;
    font-size: 0.75rem;
  }

  .footer__top {
    grid-template-columns: 1fr 1fr;
  }

  .footer__grid {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .footer__mid {
    grid-template-columns: 1fr 1fr;
  }

  .trainers__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .schedule__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .topbar__left span:last-child {
    display: none;
  }

  .hero {
    min-height: auto;
    align-items: stretch;
  }

  .hero__content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 4.5rem 0 5.5rem;
    text-align: left;
  }

  .hero__copy {
    order: 1;
    max-width: 40rem;
  }

  .hero__media {
    order: 2;
    justify-content: center;
  }

  .hero__media img {
    width: min(100%, 380px);
    margin-inline: auto;
  }

  .hero__slash--c {
    display: none;
  }

  .hero__cut {
    height: 64px;
  }

  .about__grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.75rem;
  }

  .about__side {
    display: none;
  }

  .about__media {
    min-height: 340px;
  }

  .classes__grid {
    grid-template-columns: 200px 1fr;
  }

  .classes__panel {
    grid-template-columns: 1fr;
  }

  .classes__panel img {
    min-height: 240px;
    max-height: 280px;
  }

  .classes__panel > div {
    padding: 1.25rem;
  }

  .process__row {
    gap: 1.25rem;
  }

  .process__circle {
    width: 140px;
    height: 140px;
  }

  .pricing__grid,
  .blog__grid {
    grid-template-columns: 1fr;
    max-width: 520px;
    margin-inline: auto;
  }

  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 900px) {
  .nav__links {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin: 0;
    padding: 0.75rem 1rem 1.15rem;
    background: #0f0f0f;
    border-bottom: 1px solid #222;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    max-height: min(70vh, 520px);
    overflow: auto;
  }

  .nav__links.open {
    display: flex;
  }

  .nav__links a {
    padding: 0.85rem 0.35rem;
    border-bottom: 1px solid #1c1c1c;
  }

  .nav__cta {
    display: block;
    margin-top: 0.75rem;
    border-bottom: 0 !important;
  }

  .menu-btn {
    display: grid;
    place-items: center;
  }

  .icon-btn--desktop {
    display: none;
  }

  .nav__inner {
    position: relative;
    min-height: 64px;
  }

  .nav__actions {
    margin-left: auto;
  }

  .classes__head {
    flex-direction: column;
    align-items: stretch;
  }

  .classes__grid {
    grid-template-columns: 1fr;
  }

  .process__row {
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 360px;
    margin-inline: auto;
  }

  .classes__tabs {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.35rem;
    -webkit-overflow-scrolling: touch;
  }

  .classes__tabs li {
    flex: 0 0 auto;
  }

  .classes__tabs button {
    white-space: nowrap;
    padding: 0.75rem 1rem;
  }

  .schedule__grid {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
  }

  .schedule__day {
    flex: 0 0 min(78vw, 280px);
  }

  .trainers__grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .about,
  .process,
  .classes,
  .schedule,
  .trainers,
  .pricing,
  .blog {
    padding: 3.5rem 0;
  }
}

@media (max-width: 640px) {
  .page {
    padding-bottom: 4.75rem;
  }

  .topbar {
    font-size: 0.72rem;
  }

  .topbar__inner {
    justify-content: space-between;
    gap: 0.5rem;
  }

  .topbar__left {
    gap: 0.5rem 0.85rem;
  }

  .topbar__left span:nth-child(2),
  .topbar__left span:nth-child(3) {
    display: none;
  }

  .topbar__right {
    gap: 0.4rem;
  }

  .nav__brand span {
    font-size: 1.05rem;
  }

  .nav__brand img {
    height: 34px;
  }

  .hero__content {
    padding: 3.25rem 0 4.5rem;
    gap: 1.25rem;
  }

  .hero__copy h1 {
    font-size: clamp(2.35rem, 11vw, 3.2rem);
  }

  .hero__eyebrow {
    font-size: 0.68rem;
    letter-spacing: 0.12em;
  }

  .hero__text {
    font-size: 0.92rem;
    margin-bottom: 1.25rem;
  }

  .hero__cta {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .hero__proof {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .hero__media img {
    width: min(100%, 300px);
  }

  .hero__slash--b {
    display: none;
  }

  .hero__cut {
    height: 48px;
    clip-path: polygon(0 100%, 0 70%, 50% 100%, 100% 70%, 100% 100%);
  }

  .about__grid {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .about__media {
    order: -1;
    min-height: 280px;
  }

  .about__media img {
    width: min(100%, 280px);
  }

  .about__slash {
    width: 58%;
  }

  .process__row {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .process__circle {
    width: 160px;
    height: 160px;
  }

  .trainers__grid {
    grid-template-columns: 1fr;
    max-width: 280px;
    margin-inline: auto;
  }

  .pricing__card,
  .blog__grid article {
    text-align: left;
  }

  .pricing__card ul {
    margin-inline: 0;
  }

  .footer__top,
  .footer__grid,
  .footer__mid {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }

  .footer__top {
    margin-bottom: 2rem;
  }

  .footer__gallery {
    grid-template-columns: repeat(4, 1fr);
  }

  .footer__hours li {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
  }

  .footer__bottom-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .mobile-cta {
    display: grid;
    grid-template-columns: 0.7fr 1.4fr;
    gap: 0.55rem;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    padding: 0.65rem 0.75rem calc(0.65rem + env(safe-area-inset-bottom));
    background: rgb(8 8 8 / 0.96);
    border-top: 1px solid #222;
    backdrop-filter: blur(10px);
  }

  .mobile-cta__call {
    display: grid;
    place-items: center;
    border: 1px solid #333;
    font-family: var(--font-display);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: 0.8rem;
  }

  .mobile-cta__join {
    width: 100%;
    padding: 0.85rem 0.75rem;
  }
}
</style>
