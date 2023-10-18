import Content from './content.js';

const app = Vue.createApp({
  data() {
    return {
      meta: null,
      menus: null,
      bodyColor: '',
      bgColor: '',
      linkColor: '',
    }
  },
  async created() {
    const fjUrl = 'https://stage.api.shopiece.io/free-jsons';
    // const fjUrl = './free-json.json';
    const res = await fetch(fjUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'px0dljninl'
      }
    });

    const json = await res.json();
    localStorage.setItem('menu', JSON.stringify(json.json));

    const meta = json.json.metadata;

    this.bodyColor = meta.color;
    this.bgColor = meta.bgColor;
    this.linkColor = meta.linkColor;

    document.title = meta.title;
    document.body.style.backgroundColor = meta.bgColor;

    const metaTags = document.getElementsByTagName('meta');
    for (const tag of metaTags) {
      const a = tag.getAttribute('name');
      if (a === 'description') {
        tag.setAttribute('content', meta.description);
      }
    }

    this.meta = json.json.metadata;
    this.menus = json.json.menu;
  },
  methods: {
    onClickMenu: (event) => {
      if (event.url.length === 0) {
        router.push('/', { params: { contentId: event.contentId }});
      } else {
        router.push(event.url, { params: { contentId: event.contentId }});
      }
    }
  },
  computed: {
    styleObject() {
      return {
        color: this.bodyColor,
        backgroundColor: this.bgColor,
      }
    }
  },
  template: `
    <div v-bind:style="styleObject">
      <component :is="'style'">
        a {
          color: {{ linkColor }};
        }
        .btn {
          color: {{ linkColor }};
        }
      </component>
      <main class="container">
        <div class="d-flex flex-column flex-sm-row align-items-center my-3">
          <img :src="meta?.logoUrl" class="w-25 w-sm-50">
          <header>
            <ul class="d-flex gap-3">
              <li v-for="menu in menus" class="mr-2">
                <a class="btn" @click="onClickMenu(menu)">{{ menu.name }}</a>
              </li>
            </ul>
          </header>
        </div>

        <router-view></router-view>

        <footer>{{ meta?.copyright }}</footer>
      </main>
    </div>
  `,
})

const routes = [
  {
    name: 'top',
    path: '/',
    component: Content,
    children: [
      {
        path: ':id',
        component: Content,
      },
    ]
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routes,
});

app.use(router);
app.mount('#shopiece');
