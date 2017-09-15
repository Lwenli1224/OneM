/**
 * Created by guangqiang on 2017/9/4.
 */
import React from 'react'
import {StyleSheet, Text, ListView, TouchableOpacity, RefreshControl, InteractionManager} from 'react-native'
import {BaseComponent} from '../../base/baseComponent'
import {connect} from 'react-redux'
import Action from '../../../actions'
import {commonStyle} from '../../../utils/commonStyle'
import {Actions} from 'react-native-router-flux'
import {LoadMoreFooter} from '../../loadMoreFooter'
import {ArrayTool} from '../../../utils/arrayExtension'
import {GiftedListView} from '../../common/listView'
class MovieList extends BaseComponent {

  constructor() {
    super()
    this.renderRow = this.renderRow.bind(this)
    this.fetchMoreData = this.fetchMoreData.bind(this)
    this.fetchLatestData = this.fetchLatestData.bind(this)
    this.state = {
      refreshing: false,
      hasMore: true,
      movieList: [],
    }
  }

  navigationBarProps() {
    return {
      title: 'MOVIE',
      hiddenLeftItem: true
    }
  }

  fetchLatestData() {
    this.setState({
      refreshing: true
    })
    this.props.getMovieList(0).then((response) => {
      this.setState({
        refreshing: false,
        hasMore: response.value.data.length !== 0,
        movieList: ArrayTool.splice_D(response.value.data, 0, 10)
      })
    })
  }

  fetchMoreData() {
    this.setState({
      refreshing: true
    })
    this.props.getMovieList(0).then((response) => {
      let tempArr = this.state.movieList.concat([0, 1, 2, 3, 4, 5, 6, 7, 8 ,9])
      this.setState({
        refreshing: false,
        hasMore: tempArr.length <= 60 ,
        movieList: tempArr
      })
    })
  }

  renderRow(rowData, sectionId, rowId) {
    return (
      <TouchableOpacity
        style={styles.cellStyle}
        onPress={() => Actions.movieDetail({id: rowData.id})}
      >
        <Text>{rowId}</Text>
      </TouchableOpacity>
    )
  }


  _render() {
    let dataSource = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2}).cloneWithRows(this.state.movieList)
    return (
      <GiftedListView
        initialListSize={20}
        pageSize={20}
        refreshing={this.state.refreshing}
        hasMore={this.state.hasMore}
        fetchLatestData={this.fetchLatestData}
        fetchMoreData={this.fetchMoreData}
        dataSource={dataSource}
        renderRow={this.renderRow}
      />
    )
  }
}

const styles = StyleSheet.create({
  listViewStyle: {
    flex: 1
  },
  cellStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    backgroundColor: commonStyle.white,
    borderBottomWidth: 1,
    borderBottomColor: commonStyle.lineColor
  }
})

const _MovieList = connect(
  (state) => state.movie.movieList,
  Action.dispatch('movie')
)(MovieList)

export default _MovieList