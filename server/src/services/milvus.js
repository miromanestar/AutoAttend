import { MilvusClient } from '@zilliz/milvus2-sdk-node'
import { DataType } from '@zilliz/milvus2-sdk-node/dist/milvus/types'

const milvus = new MilvusClient(process.env.MILVUS_URL)

const params = {
    name: 'faces',
    description: 'Collection of face descriptors',
    fields: [
        {
            name: 'user_id',
            data_type: DataType.Int8
        },
        {
            name: 'descriptor',
            data_type: DataType.FloatVector,
            type_params: {
                dim: 128
            }
        }
    ]
}

await milvus.collectionManager.createCollection(params)

export default milvus