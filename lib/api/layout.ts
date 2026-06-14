import db from 'lib/db';
import { maxLayouts } from 'lib/user';
import type { LayoutDataProps, LayoutViewProps } from 'types/Layout';
import PCTActions from 'data/JobActions/PCT.json';
import VPRActions from 'data/JobActions/VPR.json';

type LayoutID = string;
type UserID = number | undefined;

export async function list(userId:UserID):Promise<LayoutViewProps[]> {
  const layouts = await db.layout.findMany({
    where: { userId },
    include: {
      user: {
        select: { name: true }
      },
      _count: {
        select: { hearts: true }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: maxLayouts
  });

  return layouts.map((l) => ({
    ...l,
    createdAt: l.createdAt?.toISOString() ?? null,
    updatedAt: l.updatedAt?.toISOString() ?? null,
  })) as unknown as LayoutViewProps[];
}

export async function create(
  userId:UserID,
  data:LayoutDataProps
):Promise<LayoutDataProps> {
  if (!userId) throw new Error('User not authenticated');

  const userLayouts = await db.layout
    .findMany({ where: { userId } })
    .catch((error:Error) => {
      console.error(error);
      throw new Error('Could not create new layout.');
    });

  if (userLayouts.length > maxLayouts) {
    throw new Error('Max number of layouts reached.');
  } else {
    const { id: _id, hearted: _hearted, _count: _count2, ...createData } = data;
    const createLayout = await db.layout
      .create({
        data: { ...createData, userId } as unknown as Parameters<typeof db.layout.create>[0]['data'],
        include: {
          user: { select: { name: true } },
          parentLayout: {
            include: {
              user: {
                select: { name: true, id: true, image: true }
              },
              _count: {
                select: { hearts: true }
              }
            }
          }
        }
      })
      .catch((error:Error) => {
        console.error(error);
        throw new Error('Could not create layout.');
      });
    return createLayout as unknown as LayoutDataProps;
  }
}

export async function read(
  id: LayoutID,
  viewerId: UserID | undefined
):Promise<LayoutViewProps> {
  try {
    const layoutId = parseInt(id, 10);
    const hearted = await db.heart.findFirst({ where: { userId: viewerId, layoutId } });
    const viewData = await db.layout
      .findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          user: {
            select: { name: true, id: true, image: true }
          },
          _count: {
            select: { hearts: true }
          },
          parentLayout: {
            include: {
              user: {
                select: { name: true, id: true, image: true }
              },
              _count: {
                select: { hearts: true }
              }
            }
          }
        }
      });

    if (!viewData) throw new Error('Layout not found');

    // Because Layouts created before the 7.0 release used placeholder IDs for VPR and PCT
    // actions, we need to convert them into the release IDs to make the transition.
    // TODO: Create a script to update old placeholder IDs in the DB to migrate them to
    // the new release versions
    const jobIdString = viewData?.jobId as string;
    if (['VPR', 'PCT'].includes(jobIdString)) {
      type AltIDs = { ID:number, AltID:number }
      const newJobActions = { VPR: VPRActions.PvE.actions, PCT: PCTActions.PvE.actions };
      const ActionIDs = newJobActions[jobIdString as keyof typeof newJobActions]
        .map(({ ID, AltID }:AltIDs) => ({ ID, AltID }));
      const encodedSlotIDs = viewData.encodedSlots.split(',');
      const convertedSlots = encodedSlotIDs.map((actionId:string) => {
        const hasAltID = ActionIDs.find((act:AltIDs) => act.AltID.toString() === actionId);
        if (hasAltID) return hasAltID.ID;
        return actionId;
      }).join(',');
      viewData.encodedSlots = convertedSlots;
    }

    return {
      ...viewData,
      hearted,
      createdAt: viewData?.createdAt?.toISOString() ?? null,
      updatedAt: viewData?.updatedAt?.toISOString() ?? null,
    } as unknown as LayoutViewProps;
  } catch {
    console.error('ERROR: Could not read layout');
    throw new Error('Could not read layout.');
  }
}

export async function update(data:LayoutDataProps):Promise<LayoutDataProps> {
  const { id, hearted: _hearted, _count: _count2, ...rest } = data;
  const today = new Date().toISOString();
  const updateData = { ...rest, updatedAt: today };

  const updatedLayout = await db.layout
    .update({
      where: { id: id as number },
      data: updateData as unknown as Parameters<typeof db.layout.update>[0]['data'],
      include: { user: { select: { name: true, id: true } } }
    })
    .catch((error:Error) => {
      console.error(error);
      throw new Error('Could not update layout.');
    });

  return updatedLayout as unknown as LayoutDataProps;
}

export async function destroy(userId: UserID, { id }: { id:LayoutID }) {
  if (!userId || !id) throw new Error('Layout not found');
  await db.layout
    .deleteMany({ where: { id: parseInt(id, 10), userId } })
    .catch((error:Error) => {
      console.error(error);
      throw new Error('Could not delete layout.');
    });

  const newList = await list(userId);
  return newList;
}

const layoutsApi = {
  list, create, read, update, destroy
};

export default layoutsApi;
