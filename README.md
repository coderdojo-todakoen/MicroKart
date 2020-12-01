# Unity WebGL + micro:bit でカーレース
以前にWheel Colliderを使ってみた[Drive](https://github.com/coderdojo-todakoen/Drive)プロジェクトの車を、Bluetoothで接続したmicro:bitで操作するようにしてみました。  
PCのブラウザで動作するように、WebGLでビルドし、JavaScriptでmicro:bitに接続します。  
さらに、2つのmicro:bitを使用すると、対戦(?)できるようにしてみました。  
スピードを出しすぎると、スリップしてコントロール不能なのは相変わらずです。Wheel Colliderの使い方で調整できるのでしょうか？  
  
Asset Storeの[Low Poly Road Pack](https://assetstore.unity.com/packages/3d/environments/roadways/low-poly-road-pack-67288)を使わせていただきました。
## 動作環境
### PCブラウザ
Web Bluetooth APIに対応したブラウザ(最新のChromeやEdgeなど)を使用してください。
### micro:bit
レポジトリのmicrobitフォルダにあるhexファイルを、micro:bitに書き込みます。
## 操作方法
- Web Bluetooth APIに対応したブラウザで、[https://coderdojo-todakoen.github.io/MicroKart/](https://coderdojo-todakoen.github.io/MicroKart/)へアクセスします。
- 画面下左右の「Connect」ボタンをクリックして、一覧からmicro:bitを選択します。
- 2台のmicro:bitを接続する場合は、左右それぞれの「Connect」ボタンをクリックしてmicro:bitを選択してください。
- Aボタンで加速、Bボタンで後退します。左右の傾きで左右にカーブします。
