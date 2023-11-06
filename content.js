export default {
  data() {
    return {
      content: null,
    }
  },
  async created() {
    // 画面初期表示の処理
    const route = VueRouter.useRoute();

    const json = await this.loadContent(route.path);

    this.content = json;
  },
  async beforeRouteUpdate (to, from, next) {
    // メニューがクリックされて、contentを表示させる処理
    const params = to;
    const id = params.path;
    const json = await this.loadContent(id);

    this.content = json;

    next();
  },
  methods: {
    // content APIを呼び出す処理
    loadContent: async (path) => {
      const item = localStorage.getItem('menu');
      let menus = JSON.parse(item);
  
      console.log('setup main ===');
      console.log(menus);
  
      if (!menus || !menus.menu) {
        // location.reload();
        return;
      }
  
      let menu = menus.menu.find((m) => {
        const pathName = path.replace('/', '');
        return pathName === m.url
      });

      const res = await fetch("https://stage.api.shopiece.io" + `/contents/${menu.contentId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'x-client': 'weg5teu8gi'
        }
      });

      const json = await res.json();

      if (json) {
        document.title = json.title;

        const metaTags = document.getElementsByTagName('meta');
        for (const tag of metaTags) {
          const a = tag.getAttribute('name');
          if (a === 'description') {
            tag.setAttribute('content', json.body);
          }
        }
      }

      return json;
    }
  },
  template: `
    <div class="">
      <h1>{{ content?.title }}</h1>
      <p>
        {{ content?.body }}
      </p>

      <div v-for="block in content?.blocks" :key="block.id" :class="block.type" class="my-3">
        <p>
          {{ block.body }}
        </p>
        <img v-if="block.file" :src="block.file.domain + block.file.thumbnail">
      </div>

      <div v-for="option in content?.options" :key="option.id" class="my-3">
        <h3>{{ option. key }}</h3>
        <p>
          {{ option.value }}
        </p>
        <img v-if="option.file" :src="option.file.domain + option.file.thumbnail">
      </div>
    </div>
  `,
};