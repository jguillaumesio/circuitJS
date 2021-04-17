import c4d

def main():
    obj = doc.GetActiveObject()
    i=0
    pts_nbr=108
    spline=[]
    while i<pts_nbr:
        spline.append(obj.GetSplinePoint(i/pts_nbr))
        i+=1
    print('[')
    for i in spline:
        print('[',i[0],',',i[2],'],')
    print(']')

# Execute main()
if __name__=='__main__':
    main()