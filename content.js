export default {
  data() {
    return {
      content: null,
    }
  },
  setup: () => {
    const json = localStorage.getItem('menu');
    if (!json) {
      return;
    }

    return {
    };
  },
  async created() {
    const route = VueRouter.useRoute();

    // const json = await load(route.path);
    const json = await this.loadContent(route.path);

    this.content = json;
  },
  async beforeRouteUpdate (to, from, next) {
    const params = to;
    const id = params.path;
    // const json = await load(id);
    const json = await this.loadContent(id);

    this.content = json;

    next();
  },
  methods: {
    loadContent: async (path) => {
      const item = localStorage.getItem('menu');
      const menus = JSON.parse(item);

      let menu = menus.menu.find((m) => path === m.url);
      if (path === '/' && !menu) {
        menu = menus.menu.find((m) => '' === m.url);
      }

      const cUrl = `https://stage.api.shopiece.io/contents/${menu.contentId}`;
      // const cUrl = './contents.json';
      const res = await fetch(cUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'x-client': 'px0dljninl'
        }
      });

      const json = await res.json();

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
    </div>
  `,
};
