(function () {
  const IngredientField = {
    data() {
      return {
        ingredients: [],
      };
    },

    computed: {
      cmsdata() {
        let data = JSON.parse(JSON.stringify(this.ingredients)); // NOTE: よりよい書き方はないか
        data = data.filter(function (item) {
          return item.name && item.amount;
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

      addItem(moveFocus = false) {
        const nIngredients = this.ingredients.length;
        this.ingredients.push({ order: nIngredients + 1, name: '', amount: ''});
        if (moveFocus) {
          this.$nextTick(() => this.$refs.ingredient_name.focus());
        }
      },

      deleteItem(order) {
        const data = this.ingredients.filter(function (item) {
          return item.order !== order;
        });
        this.ingredients = this.resetOrder(data);
      },

      up(order) {
        this.ingredients[order - 1].order = order - 1;
        this.ingredients[order - 2].order = order;
        this.ingredients.sort((a, b) => a.order - b.order);
      },

      down(order) {
        this.ingredients[order - 1].order = order + 1;
        this.ingredients[order].order = order;
        this.ingredients.sort((a, b) => a.order - b.order);
      }
    },
  };

  const app = Vue.createApp(IngredientField);
  const vm = app.mount('#ingredient');

  let data = '[]';
  const base64Data = document.getElementById('ingredient').dataset.value; // NOTE: もっと良い取り方ある？
  if (base64Data) {
    data = Base64.decode(base64Data);
  }

  vm.ingredients = JSON.parse(data);
  vm.addItem();
}());
