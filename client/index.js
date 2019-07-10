import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import Description from './Components/Description.jsx'
import Specifications from './Components/Specifications.jsx'
import RatingsReviews from './Components/RatingsReviews.jsx'
import QuestionsAnswers from './Components/QuestionsAnswers.jsx'
import styles from "./styles/index.less";
import signs from './styles/signs.less';

class ProductDesc extends React.Component {
  constructor(props) {
    super(props);
    this.changeID = this.changeID.bind(this);
    this.broadcastID = this.broadcastID.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMoreReviews = this.handleMoreReviews.bind(this);
    this.style= {
        lowesMedBackground: {
          backgroundColor: "#0471AF"
        },
        lowesDarkBackground: {
          backgroundColor: "#004990"
        }
    };
    this.state = {  
        descriptions: [],
        specs: [],
        reviews: [],
        reviewStats: {},
        reviewCount : 10,
        questions: [],
        _Pid: null
     };
  }

  componentDidMount() {
    window.addEventListener('product', (e) => {
      const id = e.detail.product_id;
      axios.get(`http://ec2-18-225-6-113.us-east-2.compute.amazonaws.com/api/product/${id}?review=0`)
      .then(data => {
        if(data.data.reviewStats.reviewCount < 10) {
          this.setState({ ...data.data, reviewCount: data.data.reviewStats.reviewCount })
        } else {
          this.setState({ ...data.data, reviewCount: 10})
        }
      })
    })

    axios.get(`http://ec2-18-225-6-113.us-east-2.compute.amazonaws.com/api/product/1?review=0`)
    .then(data => {
      if(data.data.reviewStats.reviewCount < 10) {
        this.setState({ ...data.data, reviewCount: data.data.reviewStats.reviewCount })
      } else {
        console.log(data.data)  
        this.setState({ ...data.data, reviewCount: 10})
      }
    })
  }

  handleClick(sign) {
    if(Array.from(sign.classList).includes(signs.plusSign)) {
      Array.from(document.getElementsByClassName(signs.minusSign)).forEach(el => {
        el.classList.remove(signs.minusSign);
        el.classList.add(signs.plusSign);
      })
      sign.classList.remove(signs.plusSign);
      sign.classList.add(signs.minusSign);
    } else {
      sign.classList.remove(signs.minusSign);
      sign.classList.add(signs.plusSign);
    }
  }

  handleMoreReviews() {
    let id = this.state._Pid  || 1
    if(this.state.reviewStats.reviewCount - this.state.reviewCount < 10) {
      this.setState(state => {return {reviewCount: state.reviewStats.reviewCount}})
    } else {
      this.setState(state => {return {reviewCount: state.reviewCount + 10}}, () => {
        axios.get(`http://ec2-18-225-6-113.us-east-2.compute.amazonaws.com/api/product/${id}?review=${this.state.reviewCount}`)
      .then(data => {
        this.setState(state => {
          return {
            reviews: [...state.reviews, ...data.data.reviews]
          }
        })
      })
      })
    }
  }

  changeID(e) {
    this.setState({_Pid: e.target.value})
  }

  broadcastID() {
    window.dispatchEvent(new CustomEvent('product',{detail: {product_id: this.state._Pid}}))
  }
 

  render() {
    const { descriptions, specs, reviews, questions, reviewCount, reviewStats } = this.state;
    return (
      <div className={`container`}>
      <div className={styles.input}>
        <input onChange={(e) =>{this.changeID(e)}} type="text" name="" id="IDinput"/>
        <button onClick={() =>{this.broadcastID()}}>Submit</button>
      </div>
        <div className="accordion" id="accordionExample">
          <Description onClick={ this.handleClick } style={ this.style } descriptions={ descriptions } />
          <Specifications onClick={ this.handleClick } style={ this.style } specs={ specs } />
          <RatingsReviews onClick={ this.handleClick } style={ this.style } reviews={ reviews } count={reviewCount} moreReviews={this.handleMoreReviews} stats={reviewStats} />
          <QuestionsAnswers onClick={ this.handleClick } style={ this.style } questions={ questions } />
        </div>
      </div>
    );
  }
}

let domContainer = document.querySelector('#productDesc');
ReactDOM.render(<ProductDesc />, domContainer);