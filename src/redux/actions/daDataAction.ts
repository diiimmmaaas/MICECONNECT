import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getDaDataCompany = createAsyncThunk(
  'companies/getCompaniesDaData',
  async ({ query }: { query: string }, thunkAPI) => {
    try {
      let token = '8c1e482ff6157a7dca9c473e7701c187c1ecc23b'

      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Token ' + token,
        },
      }

      const response = await axios.post<any>(
        'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party',
        { query: query },
        options,
      )

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const getDaDataCity = createAsyncThunk(
  'companies/getDaDataCity',
  async ({ query }: { query: string }, thunkAPI) => {
    try {
      let token = '8c1e482ff6157a7dca9c473e7701c187c1ecc23b'

      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Token ' + token,
        },
      }

      const response = await axios.post<any>(
        'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
        { query: query, count: 3 },
        options,
      )

      const fileteredCities = response.data.suggestions.filter((sugg: any) => {
        return sugg.data.city
      })

      const uniqueArray: any = []

      fileteredCities.forEach((obj: any) => {
        const isUnique = uniqueArray.some((item: any) => item.data.city === obj.data.city)

        if (!isUnique) {
          uniqueArray.push(obj)
        }
      })

      return uniqueArray
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)
