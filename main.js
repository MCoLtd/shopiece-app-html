import Content from './content.js';

const app = Vue.createApp({
  data() {
    return {
      json: null,
      meta: null,
      menus: null,
      init: false,
    }
  },
  async mounted() {
    // free-jsons API を呼び出してホームページに表示するメニューを取得する
    const fjUrl = `https://stage.api.shopiece.io/free-jsons`;
    const res = await fetch(fjUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'weg5teu8gi'
      }
    });

    this.json = await res.json();

    localStorage.setItem('menu', JSON.stringify(this.json.json));

    if (this.json.json?.menu?.length > 0) {
      this.init = true;
    }
  },
  updated() {
    // free-jsons API から取得したcssをhtmlに反映させる
    this.meta = this.json.json.metadata;
    if (this.meta) {
      this.init = true;

      document.body.style.backgroundColor = this.meta.bgColor;
    }

    this.menus = this.json.json.menu;
  },
  methods: {
    // メニューがクリックされた場合の処理
    onClickMenu: (event) => {
      console.log(event.url);
      if (event.url.length === 0) {
        router.push('/', { params: { contentId: event.contentId }});
      } else {
        router.push('/' + event.url, { params: { contentId: event.contentId }});
      }
    }
  },
  computed: {
    // style設定
    styleObject() {
      return {
        color: this.meta?.bodyColor,
        backgroundColor: this.meta?.bgColor,
      }
    }
  },
  template: `
    <div v-bind:style="styleObject">
    <component :is="'style'">
      a {
        color: {{ meta?.linkColor }};
      }
      .btn {
        color: {{ meta?.linkColor }};
      }
    </component>
    <main class="container">
      <div v-if="!init">
        <h2>ホームページを作りましょう。</h2>
        <ol>
          <li>ページ管理のメニューから、ページを追加しましょう。</li>
          <li>ホームの編集ボタンから、メニューを追加しましょう。</li>
          <li>ホームページとして表示されます。</li>
        </ol>
      </div>
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

// vuejs初期化
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
