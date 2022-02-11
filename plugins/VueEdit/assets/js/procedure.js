(function () {
  const IngredientField = {
    data() {
      return {
        procedures: [],
      };
    },

    computed: {
      cmsdata() {
        let data = this.procedures.slice();
        data = data.filter(function (item) {
          return item.asset_id || item.text;
        });
        data = this.resetOrder(data);
        return JSON.stringify(data);
      }
    },

    methods: {
      resetOrder(data) {
        let i = 1;
        let stack = [];

        data.forEach((item) => {
          item.order = i;
          stack.push(item);
          i += 1;
        });

        return stack;
      },

      onDragEnd() {
        this.procedures = this.resetOrder(this.procedures);
      },

      addItem(moveFocus = false) {
        const nProcedures = this.procedures.length;
        this.procedures.push({ order: nProcedures + 1, asset_id: 0, text: ''});
        if (moveFocus) {
          this.$nextTick(() => this.$refs.procedure_text.focus());
        }
      },

      deleteItem(order) {
        const data = this.procedures.filter(function (item) {
          return item.order !== order;
        });
        this.procedures = this.resetOrder(data);
      },

      up(order) {
        this.procedures[order - 1].order = order - 1;
        this.procedures[order - 2].order = order;
        this.procedures.sort((a, b) => a.order - b.order);
      },

      down(order) {
        this.procedures[order - 1].order = order + 1;
        this.procedures[order].order = order;
        this.procedures.sort((a, b) => a.order - b.order);
      },

      detachRelation(e) {
        if (confirm('関連付けを解除してもよろしいですか?')) {
          this.procedures[Math.trunc(e.currentTarget.dataset.order) - 1].asset_id = 0;
        }
      }
    },
  };

  const app = Vue.createApp(IngredientField);
  app.component('draggable', vuedraggable);
  const vm = app.mount('#procedure');

  let data = '[]';
  const base64Data = document.getElementById('procedure').dataset.value; // NOTE: もっと良い取り方ある？
  if (base64Data) {
    data = Base64.decode(base64Data);
  }

  vm.procedures = JSON.parse(data);
  vm.addItem();

  // NOTE: モーダルの値がinput[type="hidden"]に反映されたとき、要素にイベントを送信しないとVueに反映されない
  //       他によい書き方はないだろうか？
  document.addEventListener('DOMContentLoaded', () => {
    const target = document.querySelector('#modal iframe');
    const observer = new MutationObserver(function (mutations) {
      if (mutations[0]?.oldValue) {
        const params = new URLSearchParams(mutations[0].oldValue);
        if (params?.has('target')) {
          const targetId = params.get('target');
          if (targetId.indexOf('asset_vue_edit') > -1) {
            const target = document.getElementById(targetId);
            target.dispatchEvent(new Event('input'));
          }
        }
      }
    });
    observer.observe(target, {
        attributes: true,
        attributeOldValue: true,
    });
  });
}());
