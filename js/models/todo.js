/**
 * Created by yuza on 2017/10/23.
 */
var app = app || {};

// Todoモデル
//---------------
// Todo項目を表すモデルには、titleとcompletedそしてorder（後述）という3つの属性が含まれます

app.Todo = Backbone.Model.extend({

  //デフォルト値を用意することによって、すべてのTodo項目にそれぞれの属性が存在することを保証します
  defaults: {
    title: '',
    completed: false
  },
  //completed属性の値をトグルします
  toggle: function () {
    this.save({
      completed: !this.get('completed')
    });
  }
});




