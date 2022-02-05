<?php
require_once LIB_DIR . 'Prototype' . DS . 'class.PTPlugin.php';

class VueEdit extends PTPlugin {

    public function __construct () {
        parent::__construct();
    }

    public function post_init( &$app ) {
        if ( $app->id !== 'Prototype' ) {
            return;
        }

        // プラグインディレクトリへのルート相対パスを変数に設定する
        $plugin_dir_array = array_filter( $app->plugin_dirs, function ( $dir ) {
            return strpos( $dir, get_class() ) !== false;
        });
        $plugin_dir = count( $plugin_dir_array ) > 0 ? array_shift( $plugin_dir_array ) : '';
        $plugin_relative_url = str_replace( $app->pt_dir . DS, '', $plugin_dir );
        $app->ctx->vars['vue_edit_asset_dir'] = $plugin_relative_url . DS . 'assets';
    }

    public function vue_edit_type ( &$app, $obj, &$data, $name = null, &$errors = [] ) {
        if ( $app->mode === 'view' ) {
            $value = $obj->$data;
            $app->ctx->vars['vue_edit_' . $name ] = $value;
        }
    }

}
