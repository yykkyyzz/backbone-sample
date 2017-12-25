/**
 * Created by yuza on 2017/10/23.
 */
var app = app || {};

// Todo項目のビュー
// -------------------

app.TodoView = Backbone.View.extend({

  tabName: 'li',
  //template: _.template($('#item-template').html()),
  //項目に固有のDOMイベント
  events: {
    'click .toggle': 'togglecompleted',
    'dbclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },
  //モデルに対する変化を監視して再描画を行います。
  //TodoとTodoViewは1対1で対応しているため、ここではモデルを直接参照しています
  initialize: function () {
    this.template = _.template($('#item-template').html());
    this.listenTo(this.model, 'change', this.render );
    this.listenTo(this.model, 'destroy', this.remove );
    this.listenTo(this.model, 'visible', this.toggleVisible );
  },
  //項目のタイトルを再描画します
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));

    this.$el.toggleClass('completed', this.model.get('completed'));
    this.toggleVisible();

    this.$input = this.$('.edit');
    return this;
  },
  //項目の表示と非表示を切り替えます
  toggleVisible: function() {
    this.$el.toggleClass('hidden', this.isHidden);
  },
  //項目を非表示にするべきか判定します
  isHidden: function() {
    var isCompleted = this.model.get('completed');
    return ( //以下の場合には非表示にします
      (!isCompleted && app.TodoFilter === 'completed')
      || (isCompleted && app.TodoFilter === 'active')
    );
  },
  //モデルのcompleted属性の値をトグルします
  togglecompleted : function() {
    this.model.toggle();
  },
  //編集モードに移行し、入力フィールドを表示します
  edit: function () {
    this.$el.addClass('editing');
    this.$input.focus();
  },
  //編集モードを終了し、Todo項目を保存します
  close: function () {
    var value = this.$input.val().trim();
    if (value) {
      this.model.save({title: value});
    }else {
      this.clear();
    }
    this.$el.removeClass('editing');
  },
  //Enterキーが押さsれると編集モードを終了します
  updateOnEnter: function (e) {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  },
  //項目を削除しモデルをlocalStorageから消去してビューも破棄します
  clear: function() {
    this.model.destroy();
  }
});
