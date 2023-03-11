const numbers = [1,2,3,4,5,6,7,8,9,10];

let images = [
  'https://cdnb.artstation.com/p/assets/images/images/017/669/991/small/mayank-kumarr-rico-natsume.jpg?1556890822',
  'https://cdnb.artstation.com/p/assets/images/images/012/051/079/small/mayank-kumar-marina-laswick.jpg?1532767464',
  'https://cdnb.artstation.com/p/assets/images/images/011/958/075/small/j-won-han-2342534334234235234.jpg?1532308453',
  'https://cdna.artstation.com/p/assets/images/images/007/823/988/small/jinsung-lim-539c27ef-acx-4302-b8d9-c845c88f7fc2.jpg?1508763004',
  'https://cdnb.artstation.com/p/assets/images/images/003/735/425/small/john-wang-practice3.jpg?1476938644',
  'https://cdna.artstation.com/p/assets/images/images/002/203/216/small/yasar-vurdem-2.jpg?1458647774',
  'https://cdnb.artstation.com/p/assets/images/images/007/118/555/small/manish-d3mon-light-study.jpg?1503829414',
  'https://cdna.artstation.com/p/assets/images/images/007/117/670/small/manish-d3mon-photostudy.jpg?1503819269',
]

let images2 = [
  'https://cdna.artstation.com/p/assets/images/images/023/108/704/small/atey-ghailan-284.jpg?1578122598',
  'https://cdnb.artstation.com/p/assets/images/images/022/502/051/small/atey-ghailan-1.jpg?1575649197',
  'https://cdnb.artstation.com/p/assets/images/images/019/318/219/small/atey-ghailan-midday.jpg?1562943107',
  'https://cdnb.artstation.com/p/assets/images/images/011/833/723/small/atey-ghailan-190b.jpg?1531670887',
]

let images3 = [
  'https://i.pinimg.com/originals/76/74/c3/7674c3141b93240fb9fb4f676428e91b.jpg',
  'https://i.pinimg.com/originals/53/5c/56/535c56dcd2fe49b41c025cc8a278da8d.jpg',
  'https://i.pinimg.com/originals/9c/c3/38/9cc3387aff52e60a93cac743d13b6e67.jpg',
  'https://i.pinimg.com/564x/68/84/fe/6884fecd3b07e248aac54b075f72cf54.jpg',
  'https://i.pinimg.com/originals/ff/89/f4/ff89f4df3e66a889ec6854d5523d0c10.jpg',
  'https://i.pinimg.com/originals/07/3c/db/073cdb32b218517424220f98fb831a09.jpg',
  'https://i.pinimg.com/originals/cf/76/dd/cf76dda30b3110427d568cdc4a1a8f1b.jpg',
  'https://i.pinimg.com/originals/f4/b4/ee/f4b4ee90d22e3ae3ca5d617dc80b92e5.jpg',
  'https://i.pinimg.com/originals/52/89/22/528922342370eb03fb38090d48c01ef7.jpg'
]

let data = [
  {
    src: 'https://cdnb.artstation.com/p/assets/images/images/017/669/991/small/mayank-kumarr-rico-natsume.jpg?1556890822',
    title: 'a',
  },
  {
    src: 'https://cdnb.artstation.com/p/assets/images/images/012/051/079/small/mayank-kumar-marina-laswick.jpg?1532767464',
    title: 'b',
  },
  {
    src: 'https://cdnb.artstation.com/p/assets/images/images/017/669/991/small/mayank-kumarr-rico-natsume.jpg?1556890822',
    title: 'c',
  },
  {
    src: 'https://cdnb.artstation.com/p/assets/images/images/012/051/079/small/mayank-kumar-marina-laswick.jpg?1532767464',
    title: 'd',
  },
  {
    src: 'https://cdnb.artstation.com/p/assets/images/images/017/669/991/small/mayank-kumarr-rico-natsume.jpg?1556890822',
    title: 'e',
  },
  {
    src: 'https://cdnb.artstation.com/p/assets/images/images/012/051/079/small/mayank-kumar-marina-laswick.jpg?1532767464',
    title: 'f',
  },
  {
    src: 'https://cdnb.artstation.com/p/assets/images/images/017/669/991/small/mayank-kumarr-rico-natsume.jpg?1556890822',
    title: 'g',
  },
  {
    src: 'https://cdnb.artstation.com/p/assets/images/images/012/051/079/small/mayank-kumar-marina-laswick.jpg?1532767464',
    title: 'h',
  },
]

let offset = 0;

function getData(offset = 0) {
  let url = `http://react-cdp-api.herokuapp.com/movies?search=&searchBy=title&sortBy=title&sortOrder=asc&offset=${offset}&limit=12`;

  return fetch(url)
    .then(res => res.json())
    .then(res => {
      //console.log(res.data);
      return res.data;
    })

}
