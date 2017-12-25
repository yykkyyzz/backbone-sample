/**
 * Created by yuza on 2017/10/23.
 */
var app = app || {};

// Todoコレクション
// --------------------
// バックエンドとしてリモートサーバーではなくlocalstorageを利用します

var TodoList = Backbone.Collection.extend({

  // このコレクションに含まれるモデル
  model: app.Todo,

  // すべてのTodo項目はtodos-backboneという名前空間に保存されます。
  // この仕組が機能するためには、ページ内にbackbone localStorage adapterが組み込まれている必要があります。
  // 読み込まれていない状態でテストを行いたい場合は、エラーの発生を避けるために次の行をコメントアウトしてください。
  localStorage: new Backbone.LocalStorage('todos-backbone'),

  // 完了済みのtodo項目だけをフィルタリングして返します
  completed: function () {
    return this.filter(function (todo) {
      return todo.get('completed');
    });
  },

  // 未了のTodo項目だけをフィルタリングして返します
  remaining: function () {
    return this.without.apply(this, this.completed());
  },

  // Todo項目は作成順に管理したいのですが、データベースないでは順不同のGUIDを使って管理されています。
  // 次に作成されるTodo項目の連番を返します。
  nextOrder: function () {
    if (!this.length) {
      return 1;
    }
    return this.last().get('order') + 1;
  },

  // Todo項目を作成順にソートします
  comparator: function (todo) {
    return todo.get('order');
  }
});

app.Todos = new TodoList();
