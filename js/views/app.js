/**
 * Created by yuza on 2017/10/23.
 */
var app = app || {};

// アプリケーション
// -----------------

// AppViewはアプリケーション全体のUIを表します
app.AppView = Backbone.View.extend({

  // スケルトンの要素としては、新規作成するのではなく既にHTMLの中に存在しているものを利用します
  el: '#todoapp',

  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': "toggleAllComplete"
  },

  // localStorageに保存されているTodo項目を読み込み、アプリケーションの処理を解釈します
  initialize: function () {
    // 画面下端に表示される、統計情報のためのテンプレート
    this.statsTemplate = _.template($('#stats-template').html());

    this.allCheckbox = this.$('#toggle-all');
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);
    this.listenTo(app.Todos, 'change:completed', this.filterOne);
    this.listenTo(app.Todos, 'filter', this.filterAll);
    //コレクション上で発生するイベントを監視
    this.listenTo(app.Todos, 'all', this.render);

    app.Todos.fetch();

    this.changeToggleAllCompleted();

  },

  // ここでは統計情報だけが更新され、他の部分は変化しません
  render: function () {
    var completed = app.Todos.completed().length;
    var remaining = app.Todos.remaining().length;

    if (app.Todos.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + (app.TodoFilter || '' ) + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }
    this.allCheckbox.checked = !remaining;
    this.allCheckbox.prop("checked",!remaining);


  },

  // 指定されたTodo項目のためのビューを作成し、<ul>要素の直下に挿入します
  addOne: function (todo) {
    var view = new app.TodoView({
      model: todo
    });
    $('#todo-list').append(view.render().el);
  },

  // コレクションに含まれているTodo項目をすべて追加します
  addAll: function () {
    this.$('#todo-list').html();
    app.Todos.each(this.addOne, this);
  },

  filterOne: function (todo) {
    todo.trigger('visible');
  },

  filterAll: function () {
    app.Todos.each(this.filterOne, this);
  },

  // 新規作成されるTodo項目のために、属性のリストを生成します
  newAttributes: function () {
    return {
      title: this.$input.val().trim(),
      order: app.Todos.nextOrder(),
      completed: false
    };
  },

  // 入力フィールドでEnterキーが押されると、Todoのモデルを作成してlocalStorageに永続化します
  // このコールバックはeventオブジェクトを使って関連付けられたため、thisはDOMの要素ではなくビューを指しています
  // ??? どのラインでsaveされているのかわからない ???
  createOnEnter: function (event) {
    if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
      return;
    }

    // Todoのモデルを新規作成し、localStorageへ永続化します
    app.Todos.create(this.newAttributes());
    this.$input.val('');
  },

  // 完了したTodo項目を全て消去し、モデルを破棄します
  clearCompleted: function () {
    _.invoke(app.Todos.completed(), 'destroy');
    return false;
  },

  toggleAllComplete: function () {
    //var completed = this.allCheckbox.checked;
    var completed = this.allCheckbox.prop('checked');

    app.Todos.each(function (todo) {
      todo.save({
        'completed': completed
      });
    });
  },
  changeToggleAllCompleted: function() {

    //すべてがcompletedならtoggle-allをtrueにする
    if( app.Todos.length === app.Todos.completed().length){
      this.allCheckbox.checked = true;
      this.allCheckbox.prop('checked',true);
    }else{
      this.allCheckbox.checked = false;
      this.allCheckbox.prop('checked',false);
    }
  }

});
